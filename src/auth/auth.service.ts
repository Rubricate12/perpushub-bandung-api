import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
      },
    });

    // Optional: Auto-login after register? Or just return success
    return {
      status: 'success',
      message: 'User registered successfully',
      data: { userId: user.id },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // 1. Generate Tokens
    const tokens = await this.getTokens(user.id, user.email);

    // 2. Save Refresh Token Hash to DB
    await this.updateRtHash(user.id, tokens.refreshToken);

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        userId: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async logout(userId: number) {
    // Delete the refresh token hash (setting it to null)
    // The user can no longer refresh their session
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: { hashedRefreshToken: null },
    });

    return { status: 'success', message: 'Logged out successfully' };
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Access Denied');

    // Compare the Refresh Token sent by client vs. the Hash in DB
    const rtMatches = await bcrypt.compare(rt, user.hashedRefreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    // If valid, generate NEW tokens (Rotation)
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return {
      status: 'success',
      message: 'Tokens refreshed successfully',
      data: tokens,
    };
  }

  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      // Access Token (Short Life)
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get<string>('JWT_SECRET') || 'SECRET_KEY_ACCESS',
          expiresIn: '1m',
        },
      ),
      // Refresh Token (Long Life)
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret:
            this.config.get<string>('JWT_REFRESH_SECRET') ||
            'SECRET_KEY_REFRESH',
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken: at, refreshToken: rt };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });
  }
}
