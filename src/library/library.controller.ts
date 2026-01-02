import { Controller, Get } from '@nestjs/common';

@Controller('libraries')
export class LibraryController {
  /*
  {
    "status": "",
    "message": "",
    "data": [
      {
        all column except createdAt, updatedAt
      }
    ]
  }
  */
  @Get()
  get() {}
}
