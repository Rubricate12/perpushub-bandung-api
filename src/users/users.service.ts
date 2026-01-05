import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // dapat user pake id
  async getById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // buat address baru
  async createAddress(userId: number, dto: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        ...dto,
        userId, // link ke user
      },
    });
  }

  // ambil addresses by userId
  async getAddressesByUserId(userId: number) {
    return this.prisma.address.findMany({
      where: { userId },
    });
  }

  // update address
  async updateAddress(userId: number, addressId: number, dto: UpdateAddressDto) {
    // cek ownership dulu sebelum update
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== userId) {
      throw new ForbiddenException('You can only update your own addresses');
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
  }

  // hapus address
  async deleteAddress(userId: number, addressId: number) {
    // cek ownership dulu sebelum hapus
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== userId) {
      throw new ForbiddenException('You can only delete your own addresses');
    }

    return this.prisma.address.delete({
      where: { id: addressId },
    });
  }
}