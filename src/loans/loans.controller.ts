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
export class LoansController {
  constructor(private service: LoansService) {}

  @UseGuards(JwtAuthGuard)
  @Get('in-delivery')
  getInDelivery(@Req() req: any) {
    return this.service.getUserLoans(req.user.userId, [
      LoanStatus.PROCESSING,
      LoanStatus.IN_DELIVERY,
    ]);
  }

  @UseGuards(JwtAuthGuard)
  @Get('borrowed')
  getBorrowed(@Req() req: any) {
    return this.service.getUserLoans(req.user.userId, [LoanStatus.BORROWED]);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@Req() req: any) {
    return this.service.getUserLoans(req.user.userId, [LoanStatus.RETURNED]);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/receive')
  receiveBook(@Req() req: any, @Param('id', ParseIntPipe) loanId: number) {
    return this.service.receiveBook(req.user.userId, loanId);
  }

  @Post(':id/deliver')
  deliverBook(@Param('id', ParseIntPipe) loanId: number) {
    return this.service.deliverBook(loanId);
  }

  @Post(':id/return')
  returnBook(@Param('id', ParseIntPipe) loanId: number) {
    return this.service.returnBook(loanId);
  }
}
