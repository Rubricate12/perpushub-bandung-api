import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  /*
  {
    "status": "",
    "message": "",
    "data": {
      "id": "",
      "username": "",
      "fullName": "",
      "email": "",
    }
  }
   */
  @Get('/:id')
  getById() {}

  /*
  {
    "status": "",
    "message": ""
  }
  */
  @Post('/:id/addresses')
  createAddress() {}

  /*
  {
    "status": "",
    "message": "",
    "data": {
      "userId": "",
      "addresses": [
      ]
    }
  }
   */
  @Get('/:id/addresses')
  getAddressesByUserId() {}
}
