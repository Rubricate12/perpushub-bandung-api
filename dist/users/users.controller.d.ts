import { UsersService } from './users.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createAddress(req: any, dto: CreateAddressDto): Promise<{
        status: string;
        message: string;
    }>;
    getAddresses(req: any): Promise<{
        status: string;
        message: string;
        data: {
            id: number;
            userId: number;
            recipientName: string;
            phoneNumber: string;
            addressLine: string;
            city: string;
            province: string;
            postalCode: string;
            label: string;
        }[];
    }>;
    getById(id: number): Promise<{
        status: string;
        message: string;
        data: {
            id: number;
            username: string;
            email: string;
            fullName: string;
        };
    }>;
    updateAddress(req: any, addressId: number, dto: UpdateAddressDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteAddress(req: any, addressId: number): Promise<{
        status: string;
        message: string;
    }>;
}
