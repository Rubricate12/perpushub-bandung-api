import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async createFromIsbn(isbn: string) {
    if (!isbn) {
      throw new BadRequestException('ISBN is required');
    }

    // cek bukunya udah ada didb belom
    const existing = await this.prisma.book.findFirst({
      where: {
        OR: [{ isbn10: isbn }, { isbn13: isbn }],
      },
    });

    if (existing) {
      throw new BadRequestException('Book already exists');
    }

    // ambil dari google books
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
    );
    const json = await res.json();

    if (!json.items || json.items.length === 0) {
      throw new BadRequestException('Book not found in Google Books');
    }

    const volume = json.items[0].volumeInfo;

    // normalisasi data jadi sesuai db kita
    const title = volume.title;
    const description = volume.description ?? '';
    const publisher = volume.publisher ?? '';
    const publishedDate = volume.publishedDate
      ? new Date(volume.publishedDate)
      : new Date();
    const pageCount = volume.pageCount ?? 0;
    const language = volume.language ?? 'en';

    const isbn10 =
      volume.industryIdentifiers?.find((i) => i.type === 'ISBN_10')
        ?.identifier ?? null;

    const isbn13 =
      volume.industryIdentifiers?.find((i) => i.type === 'ISBN_13')
        ?.identifier ?? null;

    const authors = volume.authors ?? [];
    const categories = volume.categories ?? [];

    const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

    // buat semuanya di transaction
    return this.prisma.$transaction(async (tx) => {
      const book = await tx.book.create({
        data: {
          title,
          description,
          publisher,
          publishedDate,
          isbn10: isbn10 ?? '',
          isbn13: isbn13 ?? '',
          pageCount,
          coverUrl,
          language,
        },
      });

      // buat authors
      for (const name of authors) {
        const author =
          (await tx.author.findFirst({ where: { name } })) ??
          (await tx.author.create({ data: { name } }));

        await tx.bookAuthor.create({
          data: {
            bookId: book.id,
            authorId: author.id,
          },
        });
      }

      // buat categories
      for (const name of categories) {
        const category =
          (await tx.category.findFirst({ where: { name } })) ??
          (await tx.category.create({ data: { name } }));

        await tx.bookCategory.create({
          data: {
            bookId: book.id,
            categoryId: category.id,
          },
        });
      }

      return book;
    });
  }

  async getTopBooks() {
    return this.prisma.book.findMany({
      take: 10,
      orderBy: {
        loans: {
          _count: 'desc',
        },
      },
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
    });
  }

  async getRecommendedBooks() {
    return this.prisma.book.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
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
    });
  }

  async getById(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        publisher: true,
        publishedDate: true,
        description: true,
        isbn10: true,
        isbn13: true,
        pageCount: true,
        coverUrl: true,
        language: true,
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
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async getCopiesByBookId(bookId: number) {
    return this.prisma.bookCopy.findMany({
      where: { bookId },
      select: {
        id: true,
        status: true,
        book: {
          select: {
            id: true,
            title: true,
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
    });
  }
}
