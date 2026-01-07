import { LoansService } from './loans.service';
export declare class LoansController {
    private service;
    constructor(service: LoansService);
    getInDelivery(req: any): Promise<{
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
    getInDeliveryAdmin(): Promise<{
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
    getBorrowed(req: any): Promise<{
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
    getBorrowedAdmin(): Promise<{
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
    getHistory(req: any): Promise<{
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
    receiveBook(req: any, loanId: number): Promise<{
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
