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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const common_1 = require("@nestjs/common");
const books_service_1 = require("./books.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const get_user_decorator_1 = require("../auth/decorator/get-user.decorator");
let BooksController = class BooksController {
    booksService;
    constructor(booksService) {
        this.booksService = booksService;
    }
    async create(isbn) {
        return {
            status: 'success',
            message: 'Book created from ISBN',
            data: await this.booksService.createFromIsbn(isbn),
        };
    }
    async createCopy(bookId, libraryId) {
        await this.booksService.createCopy(bookId, libraryId);
        return {
            status: 'success',
            message: 'Book copy created',
        };
    }
    async getBooks(q) {
        const books = q
            ? await this.booksService.search(q)
            : await this.booksService.findAll();
        return {
            status: 'success',
            message: q ? 'Books found' : 'All books fetched',
            data: books,
        };
    }
    async getTop() {
        return {
            status: 'success',
            message: 'Top books fetched',
            data: await this.booksService.getTopBooks(),
        };
    }
    async getUserRecommendations(userId) {
        return {
            status: 'success',
            message: 'User recommendations fetched',
            data: await this.booksService.getUserRecommendations(userId),
        };
    }
    async getById(id) {
        return {
            status: 'success',
            message: 'Book detail fetched',
            data: await this.booksService.getById(id),
        };
    }
    async getSimilarBooks(id) {
        return {
            status: 'success',
            message: 'Similar books fetched',
            data: await this.booksService.getSimilarBooks(id),
        };
    }
    async getCopiesByBookId(id) {
        return {
            status: 'success',
            message: 'Book copies fetched',
            data: await this.booksService.getCopiesByBookId(id),
        };
    }
    async rateBook(bookId, userId, body) {
        return {
            status: 'success',
            message: 'Review submitted',
            data: await this.booksService.addReview(userId, bookId, body.rating, body.comment),
        };
    }
    async getBookReviews(bookId) {
        return {
            status: 'success',
            message: 'Reviews fetched',
            data: await this.booksService.getReviews(bookId),
        };
    }
};
exports.BooksController = BooksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('isbn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('copies'),
    __param(0, (0, common_1.Body)('bookId')),
    __param(1, (0, common_1.Body)('libraryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "createCopy", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getBooks", null);
__decorate([
    (0, common_1.Get)('top'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getTop", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('recommended'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getUserRecommendations", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(':id/similar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getSimilarBooks", null);
__decorate([
    (0, common_1.Get)(':id/copies'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getCopiesByBookId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/rate'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "rateBook", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getBookReviews", null);
exports.BooksController = BooksController = __decorate([
    (0, common_1.Controller)('books'),
    __metadata("design:paramtypes", [books_service_1.BooksService])
], BooksController);
//# sourceMappingURL=books.controller.js.map