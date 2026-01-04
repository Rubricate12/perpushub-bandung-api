import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LoanRequestsService } from './loan-requests.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('loan-requests')
@UseGuards(JwtAuthGuard)
export class LoanRequestsController {
  constructor(private service: LoanRequestsService) {}

  @Post('draft')
  createDraft(@Req() req: any, @Body('bookId') bookId: number) {
    return this.service.createDraft(req.user.userId, bookId);
  }

  @Post('draft/:id/submit')
  submitDraft(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body('libraryId') libraryId: number,
    @Body('addressId') addressId: number,
    @Body('dueDate') dueDate: string,
  ) {
    return this.service.submitDraft(
      req.user.userId,
      id,
      libraryId,
      addressId,
      new Date(dueDate),
    );
  }

  @Get('draft')
  getDrafts(@Req() req: any) {
    return this.service.getDrafts(req.user.userId);
  }

  @Get('submitted')
  getSubmitted(@Req() req: any) {
    return this.service.getSubmitted(req.user.userId);
  }

  @Post(':id/approve')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body('bookCopyId', ParseIntPipe) bookCopyId: number,
    @Body('dueDate') dueDate: string,
  ) {
    return this.service.approve(id, bookCopyId, dueDate ? new Date(dueDate) : undefined);
  }

  @Post(':id/reject')
  reject(@Param('id', ParseIntPipe) id: number) {
    return this.service.reject(id);
  }
}
