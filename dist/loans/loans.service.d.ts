import { PrismaService } from '../prisma/prisma.service';
import { LoanStatus } from '@prisma/client';
export declare class LoansService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserLoans(userId: number, statuses: LoanStatus[]): Promise<{
        status: string;
        message: string;
        data: {
            id: number;
            userId: number;
            book: {
                id: number;
                title: string;
                authors: {
                    id: number;
                    name: string;
                }[];
                description: string;
                coverUrl: string;
            };
            library: {
                id: number;
                name: string;
            };
            recipientName: string;
            phoneNumber: string;
            addressLine: string;
            city: string;
            province: string;
            postalCode: string;
            dueDate: Date | null;
            status: import(".prisma/client").$Enums.LoanStatus;
        }[];
    }>;
    getUserLoansAdmin(statuses: LoanStatus[]): Promise<{
        status: string;
        message: string;
        data: {
            id: number;
            userId: number;
            book: {
                id: number;
                title: string;
                authors: {
                    id: number;
                    name: string;
                }[];
                description: string;
                coverUrl: string;
            };
            library: {
                id: number;
                name: string;
            };
            recipientName: string;
            phoneNumber: string;
            addressLine: string;
            city: string;
            province: string;
            postalCode: string;
            dueDate: Date | null;
            status: import(".prisma/client").$Enums.LoanStatus;
        }[];
    }>;
    receiveBook(userId: number, loanId: number): Promise<{
        status: string;
        message: string;
    }>;
    deliverBook(loanId: number): Promise<{
        status: string;
        message: string;
    }>;
    returnBook(loanId: number): Promise<{
        status: string;
        message: string;
    }>;
}
