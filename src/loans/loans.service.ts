import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoanStatus, BookStatus } from '@prisma/client';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  // method reusable untuk mendapatkan loans user berdasarkan status 
  async getUserLoans(userId: number, statuses: LoanStatus[]) {
    return this.prisma.loan.findMany({
      where: {
        userId: userId,
        status: { in: statuses }, // match status yang dikasih
      },
      include: {
        bookCopy: {
          include: {
            book: true, // include detail book
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
      // cari loan
      const loan = await tx.loan.findUnique({
        where: { id: loanId },
      });

      if (!loan) {
        throw new NotFoundException('Loan not found');
      }

      if (loan.status === LoanStatus.RETURNED) {
        throw new BadRequestException('Loan is already returned');
      }

      // update loan status ke returned
      const updatedLoan = await tx.loan.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.RETURNED,
          returnedAt: new Date(),
        },
      });

      // set book copy status ke available
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