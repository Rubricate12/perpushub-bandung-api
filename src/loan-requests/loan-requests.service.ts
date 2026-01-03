import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoanRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, bookId: number) {
    const existing = await this.prisma.loanRequest.findFirst({
      where: { userId, bookId },
    });

    if (existing) {
      throw new BadRequestException('Loan request already exists');
    }

    return this.prisma.loanRequest.create({
      data: {
        userId,
        bookId,
      },
    });
  }
}
