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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_address_dto_1 = require("./dto/create-address.dto");
const update_address_dto_1 = require("./dto/update-address.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createAddress(req, dto) {
        await this.usersService.createAddress(req.user.userId, dto);
        return {
            status: 'success',
            message: 'Address created successfully',
        };
    }
    async getAddresses(req) {
        const addresses = await this.usersService.getAddressesByUserId(req.user.userId);
        return {
            status: 'success',
            message: 'Addresses fetched successfully',
            data: addresses,
        };
    }
    async getById(id) {
        const user = await this.usersService.getById(id);
        return {
            status: 'success',
            message: 'User fetched successfully',
            data: user,
        };
    }
    async updateAddress(req, addressId, dto) {
        await this.usersService.updateAddress(req.user.userId, addressId, dto);
        return {
            status: 'success',
            message: 'Address updated successfully',
        };
    }
    async deleteAddress(req, addressId) {
        await this.usersService.deleteAddress(req.user.userId, addressId);
        return {
            status: 'success',
            message: 'Address deleted successfully',
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('addresses'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_address_dto_1.CreateAddressDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createAddress", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('addresses'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAddresses", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Put)('addresses/:addressId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('addressId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_address_dto_1.UpdateAddressDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateAddress", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('addresses/:addressId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('addressId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAddress", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map