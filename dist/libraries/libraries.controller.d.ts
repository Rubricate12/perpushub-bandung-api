import { LibrariesService } from './libraries.service';
import { CreateLibraryDto } from './dto/create-library.dto';
export declare class LibrariesController {
    private readonly librariesService;
    constructor(librariesService: LibrariesService);
    create(dto: CreateLibraryDto): Promise<{
        status: string;
        message: string;
    }>;
    getAll(): Promise<{
        status: string;
        message: string;
        data: {
            address: string;
            id: number;
            name: string;
            latitude: number;
            longitude: number;
        }[];
    }>;
    getById(id: number): Promise<{
        status: string;
        message: string;
        data: {
            address: string;
            id: number;
            name: string;
            latitude: number;
            longitude: number;
        };
    }>;
    getBooksByLibrary(id: number): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
}
