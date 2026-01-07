import { BooksService } from './books.service';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(isbn: string): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    createCopy(bookId: number, libraryId: number): Promise<{
        status: string;
        message: string;
    }>;
    getBooks(q?: string): Promise<{
        status: string;
        message: string;
        data: {
            authors: {
                id: number;
                name: string;
            }[];
            id: number;
            title: string;
            description: string;
            coverUrl: string;
        }[];
    }>;
    getTop(): Promise<{
        status: string;
        message: string;
        data: {
            authors: {
                id: number;
                name: string;
            }[];
            id: number;
            title: string;
            description: string;
            coverUrl: string;
        }[];
    }>;
    getUserRecommendations(userId: number): Promise<{
        status: string;
        message: string;
        data: {
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
        }[];
    }>;
    getById(id: number): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
    getSimilarBooks(id: number): Promise<{
        status: string;
        message: string;
        data: {
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
        }[];
    }>;
    getCopiesByBookId(id: number): Promise<{
        status: string;
        message: string;
        data: {
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
        }[];
    }>;
    rateBook(bookId: number, userId: number, body: {
        rating: number;
        comment?: string;
    }): Promise<{
        status: string;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            bookId: number;
            userId: number;
            rating: number;
            comment: string | null;
        };
    }>;
    getBookReviews(bookId: number): Promise<{
        status: string;
        message: string;
        data: ({
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
        })[];
    }>;
}
