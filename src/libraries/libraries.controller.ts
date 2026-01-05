import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { CreateLibraryDto } from './dto/create-library.dto';

@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Post()
  async create(@Body() dto: CreateLibraryDto) {
    return this.librariesService.create(dto);
  }

  /*
  {
    "status": "",
    "message": "",
    "data": [
      {
        "id": "",
        "name": "",
        "address": ""
      }
    ]
  }
  */
  @Get()
  async getAll() {
    return {
      status: 'success',
      message: 'Libraries fetched successfully',
      data: await this.librariesService.getAll(),
    };
  }

  /*
  {
    "status": "",
    "message": "",
    "data": {
      "id": "",
      "name": "",
      "address": "",
      "latitude": "",
      "longitude": ""
    }
  }
  */
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 'success',
      message: 'Library fetched successfully',
      data: await this.librariesService.getById(id),
    };
  }

  /*
  {
    "status": "",
    "message": "",
    "data": [
      {
        "book": {
          "id": "",
          "title": "",
          "coverUrl": ""
        },
        "availableCopies": ""
      }
    ]
  }
  */
  @Get(':id/books')
  async getBooksByLibrary(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 'success',
      message: 'Library books fetched successfully',
      data: await this.librariesService.getBooksByLibrary(id),
    };
  }
}
