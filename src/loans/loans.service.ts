import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoanStatus, BookStatus } from '@prisma/client';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  // Reusable method to get user loans based on status
  async getUserLoans(userId: number, statuses: LoanStatus[]) {
    return this.prisma.loan.findMany({
      where: {
        userId: userId,
        status: { in: statuses }, // Match the given status
      },
      include: {
        bookCopy: {
          include: {
            book: true, // Include book details
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async returnBook(loanId: number) {
    return this.prisma.$transaction(async (tx) => {
      // Find the loan
      const loan = await tx.loan.findUnique({
        where: { id: loanId },
      });

      if (!loan) {
        throw new NotFoundException('Loan not found');
      }

      if (loan.status === LoanStatus.RETURNED) {
        throw new BadRequestException('Loan is already returned');
      }

      // Update loan status to returned
      const updatedLoan = await tx.loan.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.RETURNED,
          returnedAt: new Date(),
        },
      });

      // Set book copy status to available
      await tx.bookCopy.update({
        where: { id: loan.bookCopyId },
        data: {
          status: BookStatus.AVAILABLE,
        },
      });

      return updatedLoan;
    });
  }
}
