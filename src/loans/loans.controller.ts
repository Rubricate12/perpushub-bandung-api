/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { LoanStatus } from '@prisma/client';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private service: LoansService) {}

  @Get('in-delivery')
  getInDelivery(@Req() req: any) {
    return this.service.getUserLoans(req.user.userId, [
      LoanStatus.PROCESSING,
      LoanStatus.IN_DELIVERY,
    ]);
  }

  @Get('borrowed')
  getBorrowed(@Req() req: any) {
    return this.service.getUserLoans(req.user.userId, [LoanStatus.BORROWED]);
  }

  @Get('history')
  getHistory(@Req() req: any) {
    return this.service.getUserLoans(req.user.userId, [LoanStatus.RETURNED]);
  }

  @Post(':id/return')
  returnBook(@Param('id', ParseIntPipe) loanId: number) {
    return this.service.returnBook(loanId);
  }
}
