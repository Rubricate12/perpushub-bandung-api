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
exports.LoanRequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let LoanRequestsService = class LoanRequestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDraft(userId, bookId) {
        await this.prisma.loanRequest.create({
            data: {
                userId,
                bookId,
                status: client_1.LoanRequestStatus.DRAFT,
            },
        });
        return {
            status: 'success',
            message: 'Success',
        };
    }
    async delete(userId, id) {
        const draft = await this.prisma.loanRequest.findUnique({
            where: { id },
        });
        if (!draft || draft.userId !== userId) {
            throw new common_1.NotFoundException('Draft not found');
        }
        await this.prisma.loanRequest.delete({
            where: { id },
        });
        return {
            status: 'success',
            message: 'Success',
        };
    }
    async submitDraft(userId, id, libraryId, addressId, dueDate) {
        const draft = await this.prisma.loanRequest.findUnique({
            where: { id },
        });
        if (!draft || draft.userId !== userId) {
            throw new common_1.NotFoundException('Draft not found');
        }
        if (draft.status !== client_1.LoanRequestStatus.DRAFT) {
            throw new common_1.BadRequestException('Loan request is not a draft');
        }
        const address = await this.prisma.address.findUnique({
            where: { id: addressId },
        });
        if (!address || address.userId !== userId) {
            throw new common_1.BadRequestException('Invalid address');
        }
        await this.prisma.loanRequest.update({
            where: { id },
            data: {
                libraryId,
                dueDate,
                recipientName: address.recipientName,
                phoneNumber: address.phoneNumber,
                addressLine: address.addressLine,
                city: address.city,
                province: address.province,
                postalCode: address.postalCode,
                status: client_1.LoanRequestStatus.PENDING,
            },
        });
        return {
            status: 'success',
            message: 'Success',
        };
    }
    async getDrafts(userId) {
        const drafts = await this.prisma.loanRequest.findMany({
            where: {
                userId,
                status: client_1.LoanRequestStatus.DRAFT,
            },
            select: {
                id: true,
                userId: true,
                book: {
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
                },
                status: true,
            },
            orderBy: [
                {
                    updatedAt: 'desc',
                },
            ],
        });
        return {
            status: 'success',
            message: 'Success',
            data: drafts.map((draft) => ({
                ...draft,
                book: {
                    ...draft.book,
                    authors: draft.book.authors.map((a) => ({
                        id: a.author.id,
                        name: a.author.name,
                    })),
                },
            })),
        };
    }
    async getSubmitted(userId) {
        const submitted = await this.prisma.loanRequest.findMany({
            where: {
                userId,
                status: {
                    in: [client_1.LoanRequestStatus.PENDING, client_1.LoanRequestStatus.REJECTED],
                },
            },
            select: {
                id: true,
                userId: true,
                book: {
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
                },
                library: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                recipientName: true,
                phoneNumber: true,
                addressLine: true,
                city: true,
                province: true,
                postalCode: true,
                dueDate: true,
                status: true,
            },
            orderBy: [
                {
                    updatedAt: 'desc',
                },
            ],
        });
        return {
            status: 'success',
            message: 'Success',
            data: submitted.map((s) => ({
                ...s,
                book: {
                    ...s.book,
                    authors: s.book.authors.map((a) => ({
                        id: a.author.id,
                        name: a.author.name,
                    })),
                },
                library: {
                    id: s.library?.id,
                    name: s.library?.name,
                },
            })),
        };
    }
    async getSubmittedAdmin() {
        const submitted = await this.prisma.loanRequest.findMany({
            where: {
                status: {
                    in: [client_1.LoanRequestStatus.PENDING],
                },
            },
            select: {
                id: true,
                userId: true,
                book: {
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
                },
                library: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                recipientName: true,
                phoneNumber: true,
                addressLine: true,
                city: true,
                province: true,
                postalCode: true,
                dueDate: true,
                status: true,
            },
            orderBy: [
                {
                    updatedAt: 'desc',
                },
            ],
        });
        return {
            status: 'success',
            message: 'Success',
            data: submitted.map((s) => ({
                ...s,
                book: {
                    ...s.book,
                    authors: s.book.authors.map((a) => ({
                        id: a.author.id,
                        name: a.author.name,
                    })),
                },
                library: {
                    id: s.library?.id,
                    name: s.library?.name,
                },
            })),
        };
    }
    async approve(requestId, bookCopyId, newDueDate) {
        await this.prisma.$transaction(async (tx) => {
            const loanRequest = await tx.loanRequest.findUnique({
                where: { id: requestId },
            });
            if (!loanRequest) {
                throw new common_1.NotFoundException('Loan request not found');
            }
            if (loanRequest.status !== 'PENDING') {
                throw new common_1.BadRequestException('Only PENDING requests can be approved');
            }
            const copy = await tx.bookCopy.findUnique({
                where: { id: bookCopyId },
            });
            if (!copy || copy.bookId !== loanRequest.bookId) {
                throw new common_1.BadRequestException('This copy does not belong to the requested book');
            }
            if (copy.status !== 'AVAILABLE') {
                throw new common_1.BadRequestException('This book copy is not available');
            }
            const finalDueDate = newDueDate || loanRequest.dueDate;
            if (!finalDueDate) {
                throw new common_1.BadRequestException('Due date is required');
            }
            const loan = await tx.loan.create({
                data: {
                    userId: loanRequest.userId,
                    bookCopyId: bookCopyId,
                    dueDate: finalDueDate,
                    status: client_1.LoanStatus.PROCESSING,
                    recipientName: loanRequest.recipientName,
                    phoneNumber: loanRequest.phoneNumber,
                    addressLine: loanRequest.addressLine,
                    city: loanRequest.city,
                    province: loanRequest.province,
                    postalCode: loanRequest.postalCode,
                },
            });
            await tx.bookCopy.update({
                where: { id: bookCopyId },
                data: { status: client_1.BookStatus.BORROWED },
            });
            await tx.loanRequest.update({
                where: { id: requestId },
                data: { status: client_1.LoanRequestStatus.APPROVED },
            });
            return loan;
        });
        return {
            status: 'success',
            message: 'Success',
        };
    }
    async reject(id) {
        await this.prisma.loanRequest.update({
            where: { id },
            data: {
                status: client_1.LoanRequestStatus.REJECTED,
            },
        });
        return {
            status: 'success',
            message: 'Success',
        };
    }
};
exports.LoanRequestsService = LoanRequestsService;
exports.LoanRequestsService = LoanRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoanRequestsService);
//# sourceMappingURL=loan-requests.service.js.map