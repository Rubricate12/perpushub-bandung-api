"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BooksService = class BooksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFromIsbn(isbn) {
        if (!isbn) {
            throw new common_1.BadRequestException('ISBN is required');
        }
        const existing = await this.prisma.book.findFirst({
            where: {
                OR: [{ isbn10: isbn }, { isbn13: isbn }],
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Book already exists');
        }
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        const json = await res.json();
        if (!json.items || json.items.length === 0) {
            throw new common_1.BadRequestException('Book not found in Google Books');
        }
        const volume = json.items[0].volumeInfo;
        const title = volume.title;
        const description = volume.description ?? '';
        const publisher = volume.publisher ?? '';
        const publishedDate = volume.publishedDate
            ? new Date(volume.publishedDate)
            : new Date();
        const pageCount = volume.pageCount ?? 0;
        const language = volume.language ?? 'en';
        const isbn10 = volume.industryIdentifiers?.find((i) => i.type === 'ISBN_10')?.identifier ?? null;
        const isbn13 = volume.industryIdentifiers?.find((i) => i.type === 'ISBN_13')?.identifier ?? null;
        const authors = volume.authors ?? [];
        const categories = volume.categories ?? [];
        const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
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
            for (const name of authors) {
                const author = (await tx.author.findFirst({ where: { name } })) ??
                    (await tx.author.create({ data: { name } }));
                await tx.bookAuthor.create({
                    data: {
                        bookId: book.id,
                        authorId: author.id,
                    },
                });
            }
            for (const name of categories) {
                const category = (await tx.category.findFirst({ where: { name } })) ??
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
    async createCopy(bookId, libraryId) {
        await this.prisma.bookCopy.create({
            data: {
                bookId,
                libraryId,
            },
        });
    }
    async search(query) {
        const books = await this.prisma.book.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { isbn13: { contains: query } },
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
    async getUserRecommendations(userId) {
        const TOTAL_TARGET = 15;
        const STRICT_CAP = 10;
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
        const allInteractions = [
            ...loans.map((l) => l.book),
            ...reviews.map((r) => r.book),
        ];
        const readBookIds = new Set(allInteractions.map((b) => b.id));
        const likedAuthorIds = new Set();
        const likedCategoryIds = new Set();
        allInteractions.forEach((book) => {
            book.authors.forEach((a) => likedAuthorIds.add(a.authorId));
            book.categories.forEach((c) => likedCategoryIds.add(c.categoryId));
        });
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
        const needed = TOTAL_TARGET - strictRecommendations.length;
        if (needed > 0) {
            const currentIds = strictRecommendations.map((b) => b.id);
            const excludeIds = [...Array.from(readBookIds), ...currentIds];
            const fillerBooks = await this.prisma.book.findMany({
                where: {
                    id: { notIn: excludeIds },
                },
                take: needed,
                orderBy: [{ averageRating: 'desc' }, { totalRatings: 'desc' }],
                select: this.getRecommendationSelectFields(),
            });
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
    getRecommendationSelectFields() {
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
    async getSimilarBooks(referenceBookId) {
        const referenceBook = await this.prisma.book.findUnique({
            where: { id: referenceBookId },
            include: { authors: true, categories: true },
        });
        if (!referenceBook)
            return [];
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
    async getById(id) {
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
            throw new common_1.NotFoundException('Book not found');
        }
        return {
            ...book,
            authors: book.authors.map((a) => a.author),
            categories: book.categories.map((c) => c.category),
        };
    }
    async getCopiesByBookId(bookId) {
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
    async addReview(userId, bookId, rating, comment) {
        if (rating < 1 || rating > 5) {
            throw new common_1.BadRequestException('Rating must be between 1 and 5');
        }
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book)
            throw new common_1.NotFoundException('Book not found');
        return this.prisma.$transaction(async (tx) => {
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
            const aggregations = await tx.review.aggregate({
                where: { bookId },
                _avg: { rating: true },
                _count: { rating: true },
            });
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
    async getReviews(bookId) {
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
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BooksService);
//# sourceMappingURL=books.service.js.map