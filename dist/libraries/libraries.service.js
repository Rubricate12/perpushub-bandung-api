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
exports.LibrariesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let LibrariesService = class LibrariesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        await this.prisma.library.create({
            data: {
                name: dto.name,
                address: dto.address,
                latitude: dto.latitude,
                longitude: dto.longitude,
            },
        });
        return {
            status: 'success',
            message: 'Success',
        };
    }
    async getAll() {
        return this.prisma.library.findMany({
            select: {
                id: true,
                name: true,
                address: true,
                latitude: true,
                longitude: true,
            },
        });
    }
    async getById(id) {
        const library = await this.prisma.library.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                address: true,
                latitude: true,
                longitude: true,
            },
        });
        if (!library) {
            throw new common_1.NotFoundException('Library not found');
        }
        return library;
    }
    async getBooksByLibrary(libraryId) {
        const library = await this.prisma.library.findUnique({
            where: { id: libraryId },
        });
        if (!library) {
            throw new common_1.NotFoundException('Library not found');
        }
        const copies = await this.prisma.bookCopy.findMany({
            where: {
                libraryId,
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        coverUrl: true,
                        description: true,
                    },
                },
            },
        });
        const map = new Map();
        for (const copy of copies) {
            const entry = map.get(copy.book.id) ?? {
                book: copy.book,
                availableCopies: 0,
            };
            if (copy.status === client_1.BookStatus.AVAILABLE) {
                entry.availableCopies++;
            }
            map.set(copy.book.id, entry);
        }
        return Array.from(map.values());
    }
};
exports.LibrariesService = LibrariesService;
exports.LibrariesService = LibrariesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LibrariesService);
//# sourceMappingURL=libraries.service.js.map