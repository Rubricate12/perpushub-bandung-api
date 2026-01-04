import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  LoanRequestStatus,
  BookStatus,
  LoanStatus,
} from '@prisma/client';

@Injectable()
export class LoanRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDraft(userId: number, bookId: number) {
    return this.prisma.loanRequest.create({
      data: {
        userId,
        bookId,
        status: LoanRequestStatus.DRAFT,
      },
    });
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
    //cek draft ada dan milik user
    if (!draft || draft.userId !== userId) {
      throw new NotFoundException('Draft not found');
    }
    //cek status draft
    if (draft.status !== LoanRequestStatus.DRAFT) {
      throw new BadRequestException('Loan request is not a draft');
    }
    //cek address valid dan milik user
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.userId !== userId) {
      throw new BadRequestException('Invalid address');
    }

    return this.prisma.loanRequest.update({
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
  }

  async getDrafts(userId: number) {
    // cari banyak yang berstatus draft
    return this.prisma.loanRequest.findMany({
      where: {
        userId,
        status: LoanRequestStatus.DRAFT,
      },
    });
  }

  async getSubmitted(userId: number) {
    //cari banyak yang berstatus pending / rejected
    return this.prisma.loanRequest.findMany({
      where: {
        userId,
        status: {
          in: [
            LoanRequestStatus.PENDING,
            LoanRequestStatus.REJECTED,
          ],
        },
      },
    });
  }

  async approve(requestId: number, bookCopyId: number, newDueDate?: Date) {
    return this.prisma.$transaction(async (tx) => {
      //ambil request
      const loanRequest = await tx.loanRequest.findUnique({
        where: { id: requestId },
      });

      if (!loanRequest) {
        throw new NotFoundException('Loan request not found');
      }

      if (loanRequest.status !== 'PENDING') {
        throw new BadRequestException('Only PENDING requests can be approved');
      }

      // validasi buku, copy, dan status
      const copy = await tx.bookCopy.findUnique({
        where: { id: bookCopyId },
      });

      if (!copy || copy.bookId !== loanRequest.bookId) {
        throw new BadRequestException('This copy does not belong to the requested book');
      }

      if (copy.status !== 'AVAILABLE') {
        throw new BadRequestException('This book copy is not available');
      }

      // tentukan due date
      const finalDueDate = newDueDate || loanRequest.dueDate;
      if (!finalDueDate) {
        throw new BadRequestException('Due date is required');
      }

      // buat record loan
      const loan = await tx.loan.create({
        data: {
          userId: loanRequest.userId,
          bookCopyId: bookCopyId,
          dueDate: finalDueDate,
          status: LoanStatus.BORROWED, // perlu processing kah?
          recipientName: loanRequest.recipientName!,
          phoneNumber: loanRequest.phoneNumber!,
          addressLine: loanRequest.addressLine!,
          city: loanRequest.city!,
          province: loanRequest.province!,
          postalCode: loanRequest.postalCode!,
        },
      });
      // update status book copy
      await tx.bookCopy.update({
        where: { id: bookCopyId },
        data: { status: BookStatus.BORROWED },
      });

      // update status loan request
      await tx.loanRequest.update({
         where: { id: requestId },
         data: { status: 'APPROVED' as any }, // temporary
      });

      return loan;
    });
  }

  async reject(id: number) {
    return this.prisma.loanRequest.update({
      where: { id },
      data: {
        status: LoanRequestStatus.REJECTED,
      },
    });
  }
}
