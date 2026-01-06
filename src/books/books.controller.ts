import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body('isbn') isbn: string) {
    return {
      status: 'success',
      message: 'Book created from ISBN',
      data: await this.booksService.createFromIsbn(isbn),
    };
  }

  @Get()
  async getBooks(@Query('q') q?: string) {
    const books = q 
      ? await this.booksService.search(q) 
      : await this.booksService.findAll();

    return {
      status: 'success',
      message: q ? 'Books found' : 'All books fetched',
      data: books,
    };
  }

  @Get('top')
  async getTop() {
    return {
      status: 'success',
      message: 'Top books fetched',
      data: await this.booksService.getTopBooks(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('recommended')
  async getUserRecommendations(@GetUser('id') userId: number) {
    return {
      status: 'success',
      message: 'User recommendations fetched',
      data: await this.booksService.getUserRecommendations(userId),
    };
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 'success',
      message: 'Book detail fetched',
      data: await this.booksService.getById(id),
    };
  }

  @Get(':id/similar')
  async getSimilarBooks(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 'success',
      message: 'Similar books fetched',
      data: await this.booksService.getSimilarBooks(id),
    };
  }

  @Get(':id/copies')
  async getCopiesByBookId(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 'success',
      message: 'Book copies fetched',
      data: await this.booksService.getCopiesByBookId(id),
    };
  }
}
