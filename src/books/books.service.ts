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

  async search(query: string) {
    return this.prisma.book.findMany({
      where: {
        OR: [
          // 1. Search by Title
          { title: { contains: query } }, 
          
          // 2. Search by ISBN
          { isbn13: { contains: query } },

          // 3. Search by Author Name (Advanced Nested Filter)
          {
            authors: {
              some: {
                author: {
                  name: { contains: query },
                },
              },
            },
          },
        ],
      },
      
      select: {
        id: true,
        title: true,
        coverUrl: true,
        authors: {
          select: {
            author: { select: { name: true } },
          },
        },
      },
      take: 20, 
    });
  }

  async findAll() {
    return this.prisma.book.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTopBooks() {
    return this.prisma.book.findMany({
      take: 10,
      orderBy: {
        loanRequests: {
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
  //rekomendasi berdasarkan user
  async getUserRecommendations(userId: number) {
    // get loan history
    const userHistory = await this.prisma.loanRequest.findMany({
      where: { userId },
      select: {
        book: {
          select: {
            id: true,
            authors: { select: { authorId: true } },
            categories: { select: { categoryId: true } },
          },
        },
      },
    });

    // kalo belum pernah loan, ambil books paling baru
    if (userHistory.length === 0) {
      return this.getTopBooks();
    }

    // ambil preference
    const readBookIds = userHistory.map((h) => h.book.id);

    // Get all Author IDs yang pernah dibaca
    const likedAuthorIds = [
      ...new Set(
        userHistory.flatMap((h) => h.book.authors.map((a) => a.authorId)),
      ),
    ];

    // Get all Category IDs yang pernah dibaca
    const likedCategoryIds = [
      ...new Set(
        userHistory.flatMap((h) => h.book.categories.map((c) => c.categoryId)),
      ),
    ];

    // cari rekomendasi buku berdasarkan preference
    return this.prisma.book.findMany({
      where: {
        id: { notIn: readBookIds }, // exclude buku yang udah dibaca
        OR: [
          {
            authors: {
              some: { authorId: { in: likedAuthorIds } }, // Match Authors
            },
          },
          {
            categories: {
              some: { categoryId: { in: likedCategoryIds } }, // Match Categories
            },
          },
        ],
      },
      take: 20,
      orderBy: { createdAt: 'desc' }, // Show newer books matching preferences first
      select: {
        id: true,
        title: true,
        description: true,
        coverUrl: true,
        authors: {
          select: {
            author: { select: { name: true } },
          },
        },
        categories: {
          select: {
            category: { select: { name: true } },
          },
        },
      },
    });
  }

  //itembased recommendation
  async getSimilarBooks(referenceBookId: number) {
    const referenceBook = await this.prisma.book.findUnique({
      where: { id: referenceBookId },
      include: {
        authors: true,
        categories: true,
      },
    });

    if (!referenceBook) return [];

    const authorIds = referenceBook.authors.map((a) => a.authorId);
    const categoryIds = referenceBook.categories.map((c) => c.categoryId);

    return this.prisma.book.findMany({
      where: {
        id: { not: referenceBookId },
        OR: [
          { authors: { some: { authorId: { in: authorIds } } } },
          { categories: { some: { categoryId: { in: categoryIds } } } },
        ],
      },
      take: 10, //ambil 10 buku
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        coverUrl: true,
        authors: {
          select: {
            author: { select: { name: true } },
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
