import { ReviewController } from './Review.Controller';
import { ReviewService } from './Review.service';
import { ReviewSchema } from './Review.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../Product/Product.model';
@Module({
  controllers: [ReviewController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Review', schema: ReviewSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [ReviewService],
})
export class ReviewModule {}
