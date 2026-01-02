import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, BookModule, LibraryModule],
})
export class AppModule {}

