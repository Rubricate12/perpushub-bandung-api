import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*
  {
    "status": "",
    "message": "",
    "data": {
      "id": "",
      "username": "",
      "fullName": "",
      "email": ""
    }
  }
  */
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 'success',
      message: 'User fetched successfully',
      data: await this.usersService.getById(id),
    };
  }

  /*
  {
    "status": "",
    "message": ""
  }
  */
  @Post(':id/addresses')
  async createAddress(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: CreateAddressDto,
  ) {
    await this.usersService.createAddress(userId, dto);

    return {
      status: 'success',
      message: 'Address created successfully',
    };
  }

  /*
  {
    "status": "",
    "message": "",
    "data": {
      "userId": "",
      "addresses": []
    }
  }
  */
  @Get(':id/addresses')
  async getAddressesByUserId(@Param('id', ParseIntPipe) userId: number) {
    return {
      status: 'success',
      message: 'Addresses fetched successfully',
      data: await this.usersService.getAddressesByUserId(userId),
    };
  }
}
