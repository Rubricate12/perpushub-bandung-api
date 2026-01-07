import { BookCopiesService } from './book-copies.service';
export declare class BookCopiesController {
    private readonly service;
    constructor(service: BookCopiesService);
    create(bookId: number, libraryId: number, status?: string): Promise<{
        status: string;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BookStatus;
            bookId: number;
            libraryId: number;
        };
    }>;
    get(bookId: number): Promise<{
        status: string;
        message: string;
        data: {
            library: {
                id: number;
                name: string;
            };
            id: number;
            status: import(".prisma/client").$Enums.BookStatus;
        }[];
    }>;
}
