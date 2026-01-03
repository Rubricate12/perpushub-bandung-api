import { Controller, Get, Post, Param, ParseIntPipe, Body } from '@nestjs/common';
import { BooksService } from './books.service';

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

  @Get('top')
  async getTop() {
    return {
      status: 'success',
      message: 'Top books fetched',
      data: await this.booksService.getTopBooks(),
    };
  }

  @Get('recommended')
  async getRecommended() {
    return {
      status: 'success',
      message: 'Recommended books fetched',
      data: await this.booksService.getRecommendedBooks(),
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

  @Get(':id/copies')
  async getCopiesByBookId(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 'success',
      message: 'Book copies fetched',
      data: await this.booksService.getCopiesByBookId(id),
    };
  }
}
