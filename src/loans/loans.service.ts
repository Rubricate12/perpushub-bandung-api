import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookStatus } from '@prisma/client';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async approve(loanRequestId: number, dueDate: Date) {
    const request = await this.prisma.loanRequest.findUnique({
      where: { id: loanRequestId },
      include: { book: true },
    });

    if (!request) {
      throw new BadRequestException('Loan request not found');
    }

    const copy = await this.prisma.bookCopy.findFirst({
      where: {
        bookId: request.bookId,
        status: BookStatus.AVAILABLE,
      },
    });

    if (!copy) {
      throw new BadRequestException('No available copies');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.bookCopy.update({
        where: { id: copy.id },
        data: { status: BookStatus.BORROWED },
      });

      const loan = await tx.loan.create({
        data: {
          userId: request.userId,
          bookCopyId: copy.id,
          dueDate,
        },
      });

      await tx.loanRequest.delete({
        where: { id: loanRequestId },
      });

      return loan;
    });
  }

  async returnBook(loanId: number) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan || loan.returnedAt) {
      throw new BadRequestException('Invalid loan');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.loan.update({
        where: { id: loanId },
        data: { returnedAt: new Date() },
      });

      await tx.bookCopy.update({
        where: { id: loan.bookCopyId },
        data: { status: BookStatus.AVAILABLE },
      });

      return { message: 'Book returned successfully' };
    });
  }
}
