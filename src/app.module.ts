import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { LibrariesModule } from './libraries/libraries.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';
import { BookCopiesModule } from './book-copies/book-copies.module';
import { LoanRequestsModule } from './loan-requests/loan-requests.module';

@Module({
  imports: [PrismaModule, AuthModule, BooksModule, LibrariesModule, UsersModule, LoansModule, BookCopiesModule, LoanRequestsModule],
})
export class AppModule {}

