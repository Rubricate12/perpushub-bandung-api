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
exports.LibrariesController = void 0;
const common_1 = require("@nestjs/common");
const libraries_service_1 = require("./libraries.service");
const create_library_dto_1 = require("./dto/create-library.dto");
let LibrariesController = class LibrariesController {
    librariesService;
    constructor(librariesService) {
        this.librariesService = librariesService;
    }
    async create(dto) {
        return this.librariesService.create(dto);
    }
    async getAll() {
        return {
            status: 'success',
            message: 'Libraries fetched successfully',
            data: await this.librariesService.getAll(),
        };
    }
    async getById(id) {
        return {
            status: 'success',
            message: 'Library fetched successfully',
            data: await this.librariesService.getById(id),
        };
    }
    async getBooksByLibrary(id) {
        return {
            status: 'success',
            message: 'Library books fetched successfully',
            data: await this.librariesService.getBooksByLibrary(id),
        };
    }
};
exports.LibrariesController = LibrariesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_library_dto_1.CreateLibraryDto]),
    __metadata("design:returntype", Promise)
], LibrariesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LibrariesController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LibrariesController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(':id/books'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LibrariesController.prototype, "getBooksByLibrary", null);
exports.LibrariesController = LibrariesController = __decorate([
    (0, common_1.Controller)('libraries'),
    __metadata("design:paramtypes", [libraries_service_1.LibrariesService])
], LibrariesController);
//# sourceMappingURL=libraries.controller.js.map