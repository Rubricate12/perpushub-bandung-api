import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private service: LoansService) {}

  // Move to loan-requests
  // @Post('approve')
  // approve(
  //   @Body('loanRequestId') loanRequestId: number,
  //   @Body('dueDate') dueDate: string,
  // ) {
  //   return this.service.approve(loanRequestId, new Date(dueDate));
  // }

  @Get('in-delivery')
  getInDelivery() {
    // Return entry with both PROCESSING and IN_DELIVERY status
  }

  @Get('borrowed')
  getBorrowed() {
    // Return entry with BORROWED status
  }

  @Get('history')
  getHistory() {
    // Return entry with RETURNED status
  }

  // Move :id to path
  @Post(':id/return')
  returnBook() {
    return this.service.returnBook(loanId);
  }
}
