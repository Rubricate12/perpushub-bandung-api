import { Controller, Get, Post } from '@nestjs/common';

@Controller('book-copies')
export class BookCopiesController {
  @Post()
  create() {
    // Create a new book copy from bookId, libraryId, and status (if empty use default)
  }

  @Get(':bookId')
  get() {
    // Return all book copies from specific bookId
  }
}
