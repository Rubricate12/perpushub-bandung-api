/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Use JWT guard because userId is needed from the token
  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  async createAddress(@Req() req: any, @Body() dto: CreateAddressDto) {
    // Get userId from the token
    await this.usersService.createAddress(req.user.userId, dto);

    return {
      status: 'success',
      message: 'Address created successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  async getAddresses(@Req() req: any) {
    const addresses = await this.usersService.getAddressesByUserId(
      req.user.userId,
    );

    return {
      status: 'success',
      message: 'Addresses fetched successfully',
      data: {
        addresses: addresses,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('addresses/:addressId')
  async updateAddress(
    @Req() req: any,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() dto: UpdateAddressDto,
  ) {
    // Pass userId, addressId, and DTO to the service
    await this.usersService.updateAddress(req.user.userId, addressId, dto);

    return {
      status: 'success',
      message: 'Address updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('addresses/:addressId')
  async deleteAddress(
    @Req() req: any,
    @Param('addressId', ParseIntPipe) addressId: number,
  ) {
    await this.usersService.deleteAddress(req.user.userId, addressId);

    return {
      status: 'success',
      message: 'Address deleted successfully',
    };
  }

  // Get user profile by ID
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getById(id);
    return {
      status: 'success',
      message: 'User fetched successfully',
      data: user,
    };
  }
}
