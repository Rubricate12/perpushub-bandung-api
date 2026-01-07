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
exports.LoanRequestsController = void 0;
const common_1 = require("@nestjs/common");
const loan_requests_service_1 = require("./loan-requests.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let LoanRequestsController = class LoanRequestsController {
    service;
    constructor(service) {
        this.service = service;
    }
    createDraft(req, bookId) {
        return this.service.createDraft(req.user.userId, bookId);
    }
    submitDraft(req, id, libraryId, addressId, dueDate) {
        return this.service.submitDraft(req.user.userId, id, libraryId, addressId, new Date(dueDate));
    }
    getDrafts(req) {
        return this.service.getDrafts(req.user.userId);
    }
    getSubmitted(req) {
        return this.service.getSubmitted(req.user.userId);
    }
    getSubmittedAdmin() {
        return this.service.getSubmittedAdmin();
    }
    approve(id, bookCopyId, dueDate) {
        return this.service.approve(id, bookCopyId, dueDate ? new Date(dueDate) : undefined);
    }
    reject(id) {
        return this.service.reject(id);
    }
    delete(req, id) {
        return this.service.delete(req.user.userId, id);
    }
};
exports.LoanRequestsController = LoanRequestsController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], LoanRequestsController.prototype, "createDraft", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/submit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('libraryId')),
    __param(3, (0, common_1.Body)('addressId')),
    __param(4, (0, common_1.Body)('dueDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, String]),
    __metadata("design:returntype", void 0)
], LoanRequestsController.prototype, "submitDraft", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('drafts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoanRequestsController.prototype, "getDrafts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('submitted'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoanRequestsController.prototype, "getSubmitted", null);
__decorate([
    (0, common_1.Get)('submitted/admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoanRequestsController.prototype, "getSubmittedAdmin", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('bookCopyId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('dueDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], LoanRequestsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LoanRequestsController.prototype, "reject", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], LoanRequestsController.prototype, "delete", null);
exports.LoanRequestsController = LoanRequestsController = __decorate([
    (0, common_1.Controller)('loan-requests'),
    __metadata("design:paramtypes", [loan_requests_service_1.LoanRequestsService])
], LoanRequestsController);
//# sourceMappingURL=loan-requests.controller.js.map