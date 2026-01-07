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
exports.BookCopiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BookCopiesService = class BookCopiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(bookId, libraryId, status) {
        const book = await this.prisma.book.findUnique({
            where: { id: bookId },
        });
        if (!book) {
            throw new common_1.BadRequestException('Book not found');
        }
        const library = await this.prisma.library.findUnique({
            where: { id: libraryId },
        });
        if (!library) {
            throw new common_1.BadRequestException('Library not found');
        }
        const finalStatus = status && status in client_1.BookStatus
            ? status
            : client_1.BookStatus.AVAILABLE;
        return this.prisma.bookCopy.create({
            data: {
                bookId,
                libraryId,
                status: finalStatus,
            },
        });
    }
    async getByBookId(bookId) {
        return this.prisma.bookCopy.findMany({
            where: { bookId },
            select: {
                id: true,
                status: true,
                library: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
};
exports.BookCopiesService = BookCopiesService;
exports.BookCopiesService = BookCopiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookCopiesService);
//# sourceMappingURL=book-copies.service.js.map