import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    private readonly config;
    constructor(jwtService: JwtService, prisma: PrismaService, config: ConfigService);
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
    logout(userId: number): Promise<{
        status: string;
        message: string;
    }>;
    refreshTokens(userId: number, rt: string): Promise<{
        status: string;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    getTokens(userId: number, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRtHash(userId: number, rt: string): Promise<void>;
}
