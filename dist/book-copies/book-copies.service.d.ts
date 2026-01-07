import { PrismaService } from '../prisma/prisma.service';
export declare class BookCopiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(bookId: number, libraryId: number, status?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookStatus;
        bookId: number;
        libraryId: number;
    }>;
    getByBookId(bookId: number): Promise<{
        library: {
            id: number;
            name: string;
        };
        id: number;
        status: import(".prisma/client").$Enums.BookStatus;
    }[]>;
}
