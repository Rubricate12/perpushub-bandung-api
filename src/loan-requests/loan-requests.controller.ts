import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { LoanRequestsService } from './loan-requests.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('loan-requests')
@UseGuards(JwtAuthGuard)
export class LoanRequestsController {
  constructor(private service: LoanRequestsService) {}

  @Post()
  create(@Req() req: any, @Body('bookId') bookId: number) {
    return this.service.create(req.user.userId, bookId);
  }
}
