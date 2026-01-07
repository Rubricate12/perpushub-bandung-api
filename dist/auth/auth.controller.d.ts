import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        status: string;
        message: string;
        data: {
            userId: number;
        };
    }>;
    login(dto: LoginDto): Promise<{
        status: string;
        message: string;
        data: {
            userId: number;
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(req: any): Promise<{
        status: string;
        message: string;
    }>;
    refresh(req: any): Promise<{
        status: string;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
}
