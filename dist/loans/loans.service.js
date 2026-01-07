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
exports.LoansService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let LoansService = class LoansService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserLoans(userId, statuses) {
        const loans = await this.prisma.loan.findMany({
            where: {
                userId: userId,
                status: { in: statuses },
            },
            include: {
                bookCopy: {
                    include: {
                        book: {
                            select: {
                                id: true,
                                title: true,
                                authors: {
                                    include: {
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
                        },
                        library: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        return {
            status: 'success',
            message: 'Success',
            data: loans.map((loan) => ({
                id: loan.id,
                userId: loan.userId,
                book: {
                    id: loan.bookCopy.book.id,
                    title: loan.bookCopy.book.title,
                    authors: loan.bookCopy.book.authors.map((a) => ({
                        id: a.author.id,
                        name: a.author.name,
                    })),
                    description: loan.bookCopy.book.description,
                    coverUrl: loan.bookCopy.book.coverUrl,
                },
                library: {
                    id: loan.bookCopy.library.id,
                    name: loan.bookCopy.library.name,
                },
                recipientName: loan.recipientName,
                phoneNumber: loan.phoneNumber,
                addressLine: loan.addressLine,
                city: loan.city,
                province: loan.province,
                postalCode: loan.postalCode,
                dueDate: statuses.includes(client_1.LoanStatus.RETURNED)
                    ? loan.returnedAt
                    : loan.dueDate,
                status: loan.status,
            })),
        };
    }
    async getUserLoansAdmin(statuses) {
        const loans = await this.prisma.loan.findMany({
            where: {
                status: { in: statuses },
            },
            include: {
                bookCopy: {
                    include: {
                        book: {
                            select: {
                                id: true,
                                title: true,
                                authors: {
                                    include: {
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
                        },
                        library: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        return {
            status: 'success',
            message: 'Success',
            data: loans.map((loan) => ({
                id: loan.id,
                userId: loan.userId,
                book: {
                    id: loan.bookCopy.book.id,
                    title: loan.bookCopy.book.title,
                    authors: loan.bookCopy.book.authors.map((a) => ({
                        id: a.author.id,
                        name: a.author.name,
                    })),
                    description: loan.bookCopy.book.description,
                    coverUrl: loan.bookCopy.book.coverUrl,
                },
                library: {
                    id: loan.bookCopy.library.id,
                    name: loan.bookCopy.library.name,
                },
                recipientName: loan.recipientName,
                phoneNumber: loan.phoneNumber,
                addressLine: loan.addressLine,
                city: loan.city,
                province: loan.province,
                postalCode: loan.postalCode,
                dueDate: statuses.includes(client_1.LoanStatus.RETURNED)
                    ? loan.returnedAt
                    : loan.dueDate,
                status: loan.status,
            })),
        };
    }
    async receiveBook(userId, loanId) {
        await this.prisma.$transaction(async (tx) => {
            const loan = await tx.loan.findUnique({
                where: { id: loanId, userId: userId },
            });
            if (!loan) {
                throw new common_1.NotFoundException('Loan not found');
            }
            if (loan.status !== client_1.LoanStatus.IN_DELIVERY) {
                throw new common_1.BadRequestException('Loan is not in delivery status');
            }
            await tx.loan.update({
                where: { id: loanId },
                data: {
                    status: client_1.LoanStatus.BORROWED,
                },
            });
        });
        return {
            status: 'success',
            message: 'Success',
        };
    }
    async deliverBook(loanId) {
        await this.prisma.$transaction(async (tx) => {
            const loan = await tx.loan.findUnique({
                where: { id: loanId },
            });
            if (!loan) {
                throw new common_1.NotFoundException('Loan not found');
            }
            if (loan.status === client_1.LoanStatus.IN_DELIVERY) {
                throw new common_1.BadRequestException('Loan is already delivered');
            }
            await tx.loan.update({
                where: { id: loanId },
                data: {
                    status: client_1.LoanStatus.IN_DELIVERY,
                },
            });
        });
        return {
            status: 'success',
            message: 'Success',
        };
    }
    async returnBook(loanId) {
        await this.prisma.$transaction(async (tx) => {
            const loan = await tx.loan.findUnique({
                where: { id: loanId },
            });
            if (!loan) {
                throw new common_1.NotFoundException('Loan not found');
            }
            if (loan.status === client_1.LoanStatus.RETURNED) {
                throw new common_1.BadRequestException('Loan is already returned');
            }
            const updatedLoan = await tx.loan.update({
                where: { id: loanId },
                data: {
                    status: client_1.LoanStatus.RETURNED,
                    returnedAt: new Date(),
                },
            });
            await tx.bookCopy.update({
                where: { id: loan.bookCopyId },
                data: {
                    status: client_1.BookStatus.AVAILABLE,
                },
            });
            return updatedLoan;
        });
        return {
            status: 'success',
            message: 'Success',
        };
    }
};
exports.LoansService = LoansService;
exports.LoansService = LoansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoansService);
//# sourceMappingURL=loans.service.js.map