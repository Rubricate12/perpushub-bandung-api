import { LoanRequestsService } from './loan-requests.service';
export declare class LoanRequestsController {
    private service;
    constructor(service: LoanRequestsService);
    createDraft(req: any, bookId: number): Promise<{
        status: string;
        message: string;
    }>;
    submitDraft(req: any, id: number, libraryId: number, addressId: number, dueDate: string): Promise<{
        status: string;
        message: string;
    }>;
    getDrafts(req: any): Promise<{
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
    getSubmitted(req: any): Promise<{
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
    approve(id: number, bookCopyId: number, dueDate: string): Promise<{
        status: string;
        message: string;
    }>;
    reject(id: number): Promise<{
        status: string;
        message: string;
    }>;
    delete(req: any, id: number): Promise<{
        status: string;
        message: string;
    }>;
}
