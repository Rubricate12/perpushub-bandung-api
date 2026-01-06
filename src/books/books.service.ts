/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      volume.industryIdentifiers?.find(
        (i: { type: string }) => i.type === 'ISBN_10',
      )?.identifier ?? null;

    const isbn13 =
      volume.industryIdentifiers?.find(
        (i: { type: string }) => i.type === 'ISBN_13',
      )?.identifier ?? null;

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

      return book.id;
    });
  }

  async createCopy(bookId: number, libraryId: number) {
    await this.prisma.bookCopy.create({
      data: {
        bookId,
        libraryId,
      },
    });
  }

  async search(query: string) {
    const books = await this.prisma.book.findMany({
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
      take: 20,
    });
    return books.map((book) => ({
      ...book,
      authors: book.authors.map((a) => ({
        id: a.author.id,
        name: a.author.name,
      })),
    }));
  }

  async findAll() {
    const books = await this.prisma.book.findMany({
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
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    return books.map((book) => ({
      ...book,
      authors: book.authors.map((a) => ({
        id: a.author.id,
        name: a.author.name,
      })),
    }));
  }

  async getTopBooks() {
    const books = await this.prisma.book.findMany({
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
    return books.map((book) => ({
      ...book,
      authors: book.authors.map((a) => a.author),
    }));
  }

  //rekomendasi berdasarkan user
  async getUserRecommendations(userId: number) {
    const TOTAL_TARGET = 15; // total buku yang diambil
    const STRICT_CAP = 10; // max buku personalized

    // ambil history
    const loans = await this.prisma.loanRequest.findMany({
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

    const reviews = await this.prisma.review.findMany({
      where: { userId, rating: { gte: 4 } },
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

    // campurin semua interaksi
    const allInteractions = [
      ...loans.map((l) => l.book),
      ...reviews.map((r) => r.book),
    ];

    // exclude buku yang udah dibaca
    const readBookIds = new Set(allInteractions.map((b) => b.id));

    // tambahin liked authors & categories
    const likedAuthorIds = new Set<number>();
    const likedCategoryIds = new Set<number>();

    allInteractions.forEach((book) => {
      book.authors.forEach((a) => likedAuthorIds.add(a.authorId));
      book.categories.forEach((c) => likedCategoryIds.add(c.categoryId));
    });

    // fetch rekomendasi personalized dulu
    const strictRecommendations = await this.prisma.book.findMany({
      where: {
        id: { notIn: Array.from(readBookIds) },
        OR: [
          {
            authors: { some: { authorId: { in: Array.from(likedAuthorIds) } } },
          },
          {
            categories: {
              some: { categoryId: { in: Array.from(likedCategoryIds) } },
            },
          },
        ],
      },
      take: STRICT_CAP,
      orderBy: [{ averageRating: 'desc' }, { totalRatings: 'desc' }],
      select: this.getRecommendationSelectFields(),
    });

    //fetch filler minimal 5 buku
    const needed = TOTAL_TARGET - strictRecommendations.length;

    if (needed > 0) {
      const currentIds = strictRecommendations.map((b) => b.id);
      const excludeIds = [...Array.from(readBookIds), ...currentIds];

      const fillerBooks = await this.prisma.book.findMany({
        where: {
          id: { notIn: excludeIds },
        },
        take: needed, // fill slot sisanya
        orderBy: [{ averageRating: 'desc' }, { totalRatings: 'desc' }],
        select: this.getRecommendationSelectFields(),
      });

      // Merge personalized dan filler
      return [...strictRecommendations, ...fillerBooks].map((b) => ({
        ...b,
        authors: b.authors.map((a) => ({
          id: a.author.id,
          name: a.author.name,
        })),
        categories: b.categories.map((c) => ({
          id: c.category.id,
          name: c.category.name,
        })),
      }));
    }

    return strictRecommendations.map((b) => ({
      ...b,
      authors: b.authors.map((a) => ({
        id: a.author.id,
        name: a.author.name,
      })),
      categories: b.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
      })),
    }));
  }

  // Helper aja
  private getRecommendationSelectFields() {
    return {
      id: true,
      title: true,
      coverUrl: true,
      averageRating: true,
      totalRatings: true,
      description: true,
      authors: {
        select: { author: { select: { id: true, name: true } } },
      },
      categories: {
        select: { category: { select: { id: true, name: true } } },
      },
    };
  }

  //itembased recommendation
  async getSimilarBooks(referenceBookId: number) {
    const referenceBook = await this.prisma.book.findUnique({
      where: { id: referenceBookId },
      include: { authors: true, categories: true },
    });

    if (!referenceBook) return [];

    const authorIds = referenceBook.authors.map((a) => a.authorId);
    const categoryIds = referenceBook.categories.map((c) => c.categoryId);
    const books = await this.prisma.book.findMany({
      where: {
        id: { not: referenceBookId },
        OR: [
          { authors: { some: { authorId: { in: authorIds } } } },
          { categories: { some: { categoryId: { in: categoryIds } } } },
        ],
      },
      take: 10,
      // Sort by rating dulu, baru yang terbaru
      orderBy: [{ averageRating: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        coverUrl: true,
        description: true,
        averageRating: true,
        authors: {
          select: { author: { select: { id: true, name: true } } },
        },
        categories: {
          select: { category: { select: { id: true, name: true } } },
        },
      },
    });

    return books.map((b) => ({
      ...b,
      authors: b.authors.map((a) => ({
        id: a.author.id,
        name: a.author.name,
      })),
      categories: b.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
      })),
    }));
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
        averageRating: true,
        totalRatings: true,
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
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return {
      ...book,
      authors: book.authors.map((a) => a.author), // Results in: [{id, name}, ...]
      categories: book.categories.map((c) => c.category), // Results in: [{id, name}, ...]
    };
  }

  async getCopiesByBookId(bookId: number) {
    const copies = await this.prisma.bookCopy.findMany({
      where: { bookId },
      select: {
        id: true,
        status: true,
        book: {
          select: {
            id: true,
            title: true,
            authors: {
              select: { author: { select: { id: true, name: true } } },
            },
            description: true,
            coverUrl: true,
          },
        },
        library: {
          select: { id: true, name: true },
        },
      },
    });

    return copies.map((copy) => ({
      id: copy.id,
      book: {
        id: copy.book.id,
        title: copy.book.title,
        description: copy.book.description,
        coverUrl: copy.book.coverUrl,
        authors: copy.book.authors.map((a) => ({
          id: a.author.id,
          name: a.author.name,
        })),
      },
      library: {
        id: copy.library.id,
        name: copy.library.name,
      },
      status: copy.status,
    }));
  }
  async addReview(
    userId: number,
    bookId: number,
    rating: number,
    comment?: string,
  ) {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');

    // pakai transaction karena ada beberapa step
    return this.prisma.$transaction(async (tx) => {
      //create atau update review
      const review = await tx.review.upsert({
        where: {
          userId_bookId: { userId, bookId },
        },
        update: {
          rating,
          comment,
        },
        create: {
          userId,
          bookId,
          rating,
          comment,
        },
      });

      // hitung avg baru
      const aggregations = await tx.review.aggregate({
        where: { bookId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      // update rating buku
      await tx.book.update({
        where: { id: bookId },
        data: {
          averageRating: aggregations._avg.rating || 0,
          totalRatings: aggregations._count.rating || 0,
        },
      });

      return review;
    });
  }

  //get review for book
  async getReviews(bookId: number) {
    return this.prisma.review.findMany({
      where: { bookId },
      include: {
        user: {
          select: { id: true, username: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
