import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookStatus } from '@prisma/client';

@Injectable()
export class BookCopiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    bookId: number,
    libraryId: number,
    status?: string,
  ) {
    // cari book
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!book) {
      throw new BadRequestException('Book not found');
    }

    // cari library
    const library = await this.prisma.library.findUnique({
      where: { id: libraryId },
    });
    if (!library) {
      throw new BadRequestException('Library not found');
    }

    // cari status
    const finalStatus =
      status && status in BookStatus
        ? (status as BookStatus)
        : BookStatus.AVAILABLE;

    return this.prisma.bookCopy.create({
      data: {
        bookId,
        libraryId,
        status: finalStatus,
      },
    });
  }

  async getByBookId(bookId: number) {
    return this.prisma.bookCopy.findMany({
      where: { bookId },
      select: {
        id: true,
        status: true,
        library: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
