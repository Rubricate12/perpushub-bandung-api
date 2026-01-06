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
    const loans = await this.prisma.loan.findMany({
      where: {
        userId: userId,
        status: { in: statuses },
      },
      include: {
        bookCopy: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                authors: {
                  include: {
                    author: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                description: true,
                coverUrl: true,
              },
            },
            library: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return {
      status: 'success',
      message: 'Success',
      data: loans.map((loan) => ({
        id: loan.id,
        userId: loan.userId,
        book: {
          id: loan.bookCopy.book.id,
          title: loan.bookCopy.book.title,
          authors: loan.bookCopy.book.authors.map((a) => ({
            id: a.author.id,
            name: a.author.name,
          })),
          description: loan.bookCopy.book.description,
          coverUrl: loan.bookCopy.book.coverUrl,
        },
        library: {
          id: loan.bookCopy.library.id,
          name: loan.bookCopy.library.name,
        },
        recipientName: loan.recipientName,
        phoneNumber: loan.phoneNumber,
        addressLine: loan.addressLine,
        city: loan.city,
        province: loan.province,
        postalCode: loan.postalCode,
        dueDate: statuses.includes(LoanStatus.RETURNED)
          ? loan.returnedAt
          : loan.dueDate,
        status: loan.status,
      })),
    };
  }

  async getUserLoansAdmin(statuses: LoanStatus[]) {
    const loans = await this.prisma.loan.findMany({
      where: {
        status: { in: statuses },
      },
      include: {
        bookCopy: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                authors: {
                  include: {
                    author: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                description: true,
                coverUrl: true,
              },
            },
            library: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return {
      status: 'success',
      message: 'Success',
      data: loans.map((loan) => ({
        id: loan.id,
        userId: loan.userId,
        book: {
          id: loan.bookCopy.book.id,
          title: loan.bookCopy.book.title,
          authors: loan.bookCopy.book.authors.map((a) => ({
            id: a.author.id,
            name: a.author.name,
          })),
          description: loan.bookCopy.book.description,
          coverUrl: loan.bookCopy.book.coverUrl,
        },
        library: {
          id: loan.bookCopy.library.id,
          name: loan.bookCopy.library.name,
        },
        recipientName: loan.recipientName,
        phoneNumber: loan.phoneNumber,
        addressLine: loan.addressLine,
        city: loan.city,
        province: loan.province,
        postalCode: loan.postalCode,
        dueDate: statuses.includes(LoanStatus.RETURNED)
          ? loan.returnedAt
          : loan.dueDate,
        status: loan.status,
      })),
    };
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
