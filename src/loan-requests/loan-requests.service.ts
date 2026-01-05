import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoanRequestStatus, BookStatus, LoanStatus } from '@prisma/client';

@Injectable()
export class LoanRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDraft(userId: number, bookId: number) {
    await this.prisma.loanRequest.create({
      data: {
        userId,
        bookId,
        status: LoanRequestStatus.DRAFT,
      },
    });

    return {
      status: 'success',
      message: 'Success',
    };
  }

  async delete(userId: number, id: number) {
    const draft = await this.prisma.loanRequest.findUnique({
      where: { id },
    });
    if (!draft || draft.userId !== userId) {
      throw new NotFoundException('Draft not found');
    }
    await this.prisma.loanRequest.delete({
      where: { id },
    });
    return {
      status: 'success',
      message: 'Success',
    };
  }

  async submitDraft(
    userId: number,
    id: number,
    libraryId: number,
    addressId: number,
    dueDate: Date,
  ) {
    const draft = await this.prisma.loanRequest.findUnique({
      where: { id },
    });

    // Check if the draft exists and is owned by the user
    if (!draft || draft.userId !== userId) {
      throw new NotFoundException('Draft not found');
    }
    // Check the draft status
    if (draft.status !== LoanRequestStatus.DRAFT) {
      throw new BadRequestException('Loan request is not a draft');
    }
    // Check if the address is valid and belongs to the user
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.userId !== userId) {
      throw new BadRequestException('Invalid address');
    }

    await this.prisma.loanRequest.update({
      where: { id },
      data: {
        libraryId,
        dueDate,
        recipientName: address.recipientName,
        phoneNumber: address.phoneNumber,
        addressLine: address.addressLine,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        status: LoanRequestStatus.PENDING,
      },
    });

    return {
      status: 'success',
      message: 'Success',
    };
  }

  async getDrafts(userId: number) {
    // Find all drafts
    const drafts = await this.prisma.loanRequest.findMany({
      where: {
        userId,
        status: LoanRequestStatus.DRAFT,
      },
      select: {
        id: true,
        userId: true,
        book: {
          select: {
            id: true,
            title: true,
            description: true,
            coverUrl: true,
            authors: {
              select: {
                author: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        status: true,
      },
    });

    return {
      status: 'success',
      message: 'Success',
      data: drafts.map((draft) => ({
        ...draft,
        book: {
          ...draft.book,
          authors: draft.book.authors.map((a) => ({
            id: a.author.id,
            name: a.author.name,
          })),
        },
      })),
    };
  }

  async getSubmitted(userId: number) {
    // Find all pending or rejected requests
    const submitted = await this.prisma.loanRequest.findMany({
      where: {
        userId,
        status: {
          in: [LoanRequestStatus.PENDING, LoanRequestStatus.REJECTED],
        },
      },
      select: {
        id: true,
        userId: true,
        book: {
          select: {
            id: true,
            title: true,
            description: true,
            coverUrl: true,
            authors: {
              select: {
                author: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        library: {
          select: {
            id: true,
            name: true,
          },
        },
        recipientName: true,
        phoneNumber: true,
        addressLine: true,
        city: true,
        province: true,
        postalCode: true,
        dueDate: true,
        status: true,
      },
    });

    return {
      status: 'success',
      message: 'Success',
      data: submitted.map((s) => ({
        ...s,
        book: {
          ...s.book,
          authors: s.book.authors.map((a) => ({
            id: a.author.id,
            name: a.author.name,
          })),
        },
        library: {
          id: s.library?.id,
          name: s.library?.name,
        },
      })),
    };
  }

  async approve(requestId: number, bookCopyId: number, newDueDate?: Date) {
    await this.prisma.$transaction(async (tx) => {
      // Get the request
      const loanRequest = await tx.loanRequest.findUnique({
        where: { id: requestId },
      });

      if (!loanRequest) {
        throw new NotFoundException('Loan request not found');
      }

      if (loanRequest.status !== 'PENDING') {
        throw new BadRequestException('Only PENDING requests can be approved');
      }

      // Validate the book, copy, and status
      const copy = await tx.bookCopy.findUnique({
        where: { id: bookCopyId },
      });

      if (!copy || copy.bookId !== loanRequest.bookId) {
        throw new BadRequestException(
          'This copy does not belong to the requested book',
        );
      }

      if (copy.status !== 'AVAILABLE') {
        throw new BadRequestException('This book copy is not available');
      }

      // Determine the due date
      const finalDueDate = newDueDate || loanRequest.dueDate;
      if (!finalDueDate) {
        throw new BadRequestException('Due date is required');
      }

      // Create a loan record
      const loan = await tx.loan.create({
        data: {
          userId: loanRequest.userId,
          bookCopyId: bookCopyId,
          dueDate: finalDueDate,
          status: LoanStatus.PROCESSING,
          recipientName: loanRequest.recipientName!,
          phoneNumber: loanRequest.phoneNumber!,
          addressLine: loanRequest.addressLine!,
          city: loanRequest.city!,
          province: loanRequest.province!,
          postalCode: loanRequest.postalCode!,
        },
      });
      // Update the book copy status
      await tx.bookCopy.update({
        where: { id: bookCopyId },
        data: { status: BookStatus.BORROWED },
      });

      // Update the loan request status
      await tx.loanRequest.update({
        where: { id: requestId },
        data: { status: LoanRequestStatus.APPROVED },
      });

      return loan;
    });

    return {
      status: 'success',
      message: 'Success',
    };
  }

  async reject(id: number) {
    await this.prisma.loanRequest.update({
      where: { id },
      data: {
        status: LoanRequestStatus.REJECTED,
      },
    });

    return {
      status: 'success',
      message: 'Success',
    };
  }
}
