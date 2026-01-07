import { PrismaService } from '../prisma/prisma.service';
export declare class BooksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createFromIsbn(isbn: string): Promise<number>;
    createCopy(bookId: number, libraryId: number): Promise<void>;
    search(query: string): Promise<{
        authors: {
            id: number;
            name: string;
        }[];
        id: number;
        title: string;
        description: string;
        coverUrl: string;
    }[]>;
    findAll(): Promise<{
        authors: {
            id: number;
            name: string;
        }[];
        id: number;
        title: string;
        description: string;
        coverUrl: string;
    }[]>;
    getTopBooks(): Promise<{
        authors: {
            id: number;
            name: string;
        }[];
        id: number;
        title: string;
        description: string;
        coverUrl: string;
    }[]>;
    getUserRecommendations(userId: number): Promise<{
        authors: {
            id: number;
            name: string;
        }[];
        categories: {
            id: number;
            name: string;
        }[];
        id: number;
        title: string;
        description: string;
        coverUrl: string;
        averageRating: number;
        totalRatings: number;
    }[]>;
    private getRecommendationSelectFields;
    getSimilarBooks(referenceBookId: number): Promise<{
        authors: {
            id: number;
            name: string;
        }[];
        categories: {
            id: number;
            name: string;
        }[];
        id: number;
        title: string;
        description: string;
        coverUrl: string;
        averageRating: number;
    }[]>;
    getById(id: number): Promise<{
        authors: {
            id: number;
            name: string;
        }[];
        categories: {
            id: number;
            name: string;
        }[];
        id: number;
        reviews: {
            user: {
                id: number;
                username: string;
                fullName: string;
            };
            id: number;
            createdAt: Date;
            rating: number;
            comment: string | null;
        }[];
        title: string;
        publisher: string;
        publishedDate: Date;
        description: string;
        isbn10: string;
        isbn13: string;
        pageCount: number;
        coverUrl: string;
        language: string;
        averageRating: number;
        totalRatings: number;
    }>;
    getCopiesByBookId(bookId: number): Promise<{
        id: number;
        book: {
            id: number;
            title: string;
            description: string;
            coverUrl: string;
            authors: {
                id: number;
                name: string;
            }[];
        };
        library: {
            id: number;
            name: string;
        };
        status: import(".prisma/client").$Enums.BookStatus;
    }[]>;
    addReview(userId: number, bookId: number, rating: number, comment?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookId: number;
        userId: number;
        rating: number;
        comment: string | null;
    }>;
    getReviews(bookId: number): Promise<({
        user: {
            id: number;
            username: string;
            fullName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookId: number;
        userId: number;
        rating: number;
        comment: string | null;
    })[]>;
}
