import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // --------------------
  // REGISTER
  // --------------------
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

    return {
      status: 'success',
      message: 'User registered successfully',
      data: {
        userId: user.id,
      },
    };
  }

  // --------------------
  // LOGIN
  // --------------------
  async login(dto: LoginDto) {
    if (!dto?.email || !dto?.password) {
      throw new UnauthorizedException('Email and password required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        userId: user.id,
        accessToken: this.jwtService.sign(payload),
      },
    };
  }
}
