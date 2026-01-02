import { Controller, Get, Post } from '@nestjs/common';

@Controller('books')
export class BookController {
  @Post()
  create() {
    // fetch book data from Google Books and insert to DB based on ISBN
    // for coverUrl use resource from OpenLibrary "https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg"
  }

  /*
  {
    "status": "",
    "message": "",
    "data": [
      {
        "id": "",
        "title": "",
        "authors": [
          {
            "id": "",
            "name": ""
          }
        ],
        "description": "",
        "coverUrl": ""
      }
    ]
  }
  */
  @Get('/top')
  getTop() {}

  @Get('/recommended')
  getRecommended() {}

  /*
  {
    "status": "",
    "message": "",
    "data": {
      all column except createdAt, updatedAt
    }
  }
  */
  @Get('/:id')
  getById() {}

  /*
  {
    "status": "",
    "message": "",
    "data": [
      {
        "id": "",
        "book": {
          "id": "",
          "title": "",
          "authors": [
            {
              "id": "",
              "name": ""
            }
          ],
          "description": "",
          "coverUrl": ""
        },
        "library": {
          "id": "",
          "name": ""
        },
        "status": ""
      }
    ]
  }
  */
  @Get('/:id/copies')
  getCopiesByBookId() {}
}
