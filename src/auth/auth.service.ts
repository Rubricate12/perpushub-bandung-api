import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private jwtService: JwtService) {}

  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user: User = {
      id: this.users.length + 1,
      username: data.username,
      email: data.email,
      password: hashedPassword,
    };

    this.users.push(user);

    return { message: 'User registered successfully' };
  }

  async login(data: LoginDto) {
    if (!data?.email || !data?.password) {
    throw new UnauthorizedException('Email and password required');
    }

    const user = this.users.find(u => u.email === data.email);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
