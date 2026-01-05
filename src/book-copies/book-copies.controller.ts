import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { BookCopiesService } from './book-copies.service';

@Controller('book-copies')
export class BookCopiesController {
  constructor(private readonly service: BookCopiesService) {}

  /*
  Body:
  {
    "bookId": 1,
    "libraryId": 2,
    "status": "AVAILABLE"
  }
  */
  @Post()
  async create(
    @Body('bookId', ParseIntPipe) bookId: number,
    @Body('libraryId', ParseIntPipe) libraryId: number,
    @Body('status') status?: string,
  ) {
    return {
      status: 'success',
      message: 'Book copy created',
      data: await this.service.create(bookId, libraryId, status),
    };
  }

  @Get(':bookId')
  async get(@Param('bookId', ParseIntPipe) bookId: number) {
    return {
      status: 'success',
      message: 'Book copies fetched',
      data: await this.service.getByBookId(bookId),
    };
  }
}
