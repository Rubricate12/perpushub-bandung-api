import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { LoanRequestsService } from './loan-requests.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('loan-requests')
@UseGuards(JwtAuthGuard)
export class LoanRequestsController {
  constructor(private service: LoanRequestsService) {}

  @Post('draft')
  create(@Req() req: any, @Body('bookId') bookId: number) {
    // Status need to be assigned to DRAFT
    return this.service.create(req.user.userId, bookId);
  }

  /*
  {
    "status": "",
    "message": ""
  }
   */
  @Post('draft/:id/submit')
  submit() {
    // Body will carry libraryId, addressId, and dueDate
    // Assign address snapshot in the LoanRequest by the provided addressId
    // Status need to be assigned to PENDING
  }

  @Get('draft')
  getDrafts() {
    // Return all with status DRAFT
  }

  @Get('submitted')
  getSubmitted() {
    // Return all with status PENDING or REJECTED
  }

  @Post(':id/approve')
  approve() {
    // Delete this entry and create new loan entry
    // bookCopyId will be provided from body
  }

  @Post(':id/reject')
  reject() {
    // Status need to be assigned to REJECTED
  }
}
