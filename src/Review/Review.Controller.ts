import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateReview } from '../utils/Validator/CreateReview.validate';
import { CommentTrim } from '../utils/pipes/CommentTrim.pipe';
import { ReviewService } from './Review.service';
import { AuthenticatedGuard } from '../utils/Guards/Authenticated.guard';
import { ValidateId } from '../utils/pipes/idValidation.pipe';
import { Request } from 'express';
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async addReview(
    @Body(CommentTrim) reviewObj: CreateReview,
    @Req() req: Request,
  ) {
    return await this.reviewService.addReview(reviewObj, req.user.id);
  }

  @Get('count/:id')
  async getCountOfProdcutReview(@Param('id', ValidateId) productId: string) {
    const count = await this.reviewService.getCountOfTheReview(productId);
    return { count };
  }

  @Get(':id')
  async getAllReviewOfProduct(@Param('id', ValidateId) productId: string) {
    const reviews = await this.reviewService.getAllReviews(productId);
    return { reviews };
  }
}
