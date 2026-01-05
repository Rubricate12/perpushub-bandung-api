import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookStatus, LoanStatus } from '@prisma/client';

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

  async receiveBook(userId: number, loanId: number) {
    await this.prisma.$transaction(async (tx) => {
      // Find the loan
      const loan = await tx.loan.findUnique({
        where: { id: loanId, userId: userId },
      });

      if (!loan) {
        throw new NotFoundException('Loan not found');
      }

      if (loan.status !== LoanStatus.IN_DELIVERY) {
        throw new BadRequestException('Loan is not in delivery status');
      }

      // Update loan status to borrowed
      await tx.loan.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.BORROWED,
        },
      });
    });

    return {
      status: 'success',
      message: 'Success',
    };
  }

  async deliverBook(loanId: number) {
    await this.prisma.$transaction(async (tx) => {
      // Find the loan
      const loan = await tx.loan.findUnique({
        where: { id: loanId },
      });

      if (!loan) {
        throw new NotFoundException('Loan not found');
      }

      if (loan.status === LoanStatus.IN_DELIVERY) {
        throw new BadRequestException('Loan is already delivered');
      }

      await tx.loan.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.IN_DELIVERY,
        },
      });
    });

    return {
      status: 'success',
      message: 'Success',
    };
  }

  async returnBook(loanId: number) {
    await this.prisma.$transaction(async (tx) => {
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

    return {
      status: 'success',
      message: 'Success',
    };
  }
}
