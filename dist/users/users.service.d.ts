import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getById(id: number): Promise<{
        id: number;
        username: string;
        email: string;
        fullName: string;
    }>;
    createAddress(userId: number, dto: CreateAddressDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        recipientName: string;
        phoneNumber: string;
        addressLine: string;
        city: string;
        province: string;
        postalCode: string;
        label: string;
    }>;
    getAddressesByUserId(userId: number): Promise<{
        id: number;
        userId: number;
        recipientName: string;
        phoneNumber: string;
        addressLine: string;
        city: string;
        province: string;
        postalCode: string;
        label: string;
    }[]>;
    updateAddress(userId: number, addressId: number, dto: UpdateAddressDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        recipientName: string;
        phoneNumber: string;
        addressLine: string;
        city: string;
        province: string;
        postalCode: string;
        label: string;
    }>;
    deleteAddress(userId: number, addressId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        recipientName: string;
        phoneNumber: string;
        addressLine: string;
        city: string;
        province: string;
        postalCode: string;
        label: string;
    }>;
}
