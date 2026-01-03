import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private service: LoansService) {}

  @Post('approve')
  approve(
    @Body('loanRequestId') loanRequestId: number,
    @Body('dueDate') dueDate: string,
  ) {
    return this.service.approve(loanRequestId, new Date(dueDate));
  }

  @Post('return')
  returnBook(@Body('loanId') loanId: number) {
    return this.service.returnBook(loanId);
  }
}
