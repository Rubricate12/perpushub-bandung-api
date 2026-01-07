import { PrismaService } from '../prisma/prisma.service';
import { CreateLibraryDto } from './dto/create-library.dto';
export declare class LibrariesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateLibraryDto): Promise<{
        status: string;
        message: string;
    }>;
    getAll(): Promise<{
        address: string;
        id: number;
        name: string;
        latitude: number;
        longitude: number;
    }[]>;
    getById(id: number): Promise<{
        address: string;
        id: number;
        name: string;
        latitude: number;
        longitude: number;
    }>;
    getBooksByLibrary(libraryId: number): Promise<any[]>;
}
