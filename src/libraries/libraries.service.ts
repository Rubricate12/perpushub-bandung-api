import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookStatus } from '@prisma/client';

@Injectable()
export class LibrariesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.library.findMany({
      select: {
        id: true,
        name: true,
        address: true,
      },
    });
  }

  async getById(id: number) {
    const library = await this.prisma.library.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    return library;
  }

  async getBooksByLibrary(libraryId: number) {
    const library = await this.prisma.library.findUnique({
      where: { id: libraryId },
    });

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    const copies = await this.prisma.bookCopy.findMany({
      where: {
        libraryId,
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
          },
        },
      },
    });

    const map = new Map<number, any>();

    for (const copy of copies) {
      const entry = map.get(copy.book.id) ?? {
        book: copy.book,
        availableCopies: 0,
      };

      if (copy.status === BookStatus.AVAILABLE) {
        entry.availableCopies++;
      }

      map.set(copy.book.id, entry);
    }

    return Array.from(map.values());
  }
}
