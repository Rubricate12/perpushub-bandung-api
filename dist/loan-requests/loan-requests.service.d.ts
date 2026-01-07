import { PrismaService } from '../prisma/prisma.service';
export declare class LoanRequestsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createDraft(userId: number, bookId: number): Promise<{
        status: string;
        message: string;
    }>;
    delete(userId: number, id: number): Promise<{
        status: string;
        message: string;
    }>;
    submitDraft(userId: number, id: number, libraryId: number, addressId: number, dueDate: Date): Promise<{
        status: string;
        message: string;
    }>;
    getDrafts(userId: number): Promise<{
        status: string;
        message: string;
        data: {
            book: {
                authors: {
                    id: number;
                    name: string;
                }[];
                id: number;
                title: string;
                description: string;
                coverUrl: string;
            };
            id: number;
            status: import(".prisma/client").$Enums.LoanRequestStatus;
            userId: number;
        }[];
    }>;
    getSubmitted(userId: number): Promise<{
        status: string;
        message: string;
        data: {
            book: {
                authors: {
                    id: number;
                    name: string;
                }[];
                id: number;
                title: string;
                description: string;
                coverUrl: string;
            };
            library: {
                id: number | undefined;
                name: string | undefined;
            };
            id: number;
            status: import(".prisma/client").$Enums.LoanRequestStatus;
            userId: number;
            recipientName: string | null;
            phoneNumber: string | null;
            addressLine: string | null;
            city: string | null;
            province: string | null;
            postalCode: string | null;
            dueDate: Date | null;
        }[];
    }>;
    getSubmittedAdmin(): Promise<{
        status: string;
        message: string;
        data: {
            book: {
                authors: {
                    id: number;
                    name: string;
                }[];
                id: number;
                title: string;
                description: string;
                coverUrl: string;
            };
            library: {
                id: number | undefined;
                name: string | undefined;
            };
            id: number;
            status: import(".prisma/client").$Enums.LoanRequestStatus;
            userId: number;
            recipientName: string | null;
            phoneNumber: string | null;
            addressLine: string | null;
            city: string | null;
            province: string | null;
            postalCode: string | null;
            dueDate: Date | null;
        }[];
    }>;
    approve(requestId: number, bookCopyId: number, newDueDate?: Date): Promise<{
        status: string;
        message: string;
    }>;
    reject(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
