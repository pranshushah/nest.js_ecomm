import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, reviewAttrWithoutUserID } from './Review.model';
import { Product } from '../Product/Product.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async addReview(newReviewObj: reviewAttrWithoutUserID, userId: string) {
    try {
      const [reviewCountObj, productObj] = await Promise.allSettled([
        this.reviewModel
          .find({
            productId: newReviewObj.productId,
          })
          .countDocuments(),
        this.productModel.findById(newReviewObj.productId),
      ]);
      if (
        reviewCountObj.status === 'fulfilled' &&
        productObj.status === 'fulfilled'
      ) {
        if (productObj.value === null) {
          throw new BadRequestException('incorrect productid');
        }
        //we have overallreview but we don't have the previous review so we are considering them as 2 reviews
        reviewCountObj.value = reviewCountObj.value + 2;
        const newOverAllRatings =
          (productObj.value.overall_rating * reviewCountObj.value +
            newReviewObj.stars) /
          (reviewCountObj.value + 1);
        const newReview = { ...newReviewObj, userId };
        if (!newReview.comment?.trim()) {
          delete newReview.comment;
        }
        const [reviewDoc, newProduct] = await Promise.allSettled([
          new this.reviewModel(newReview).save(),
          this.productModel.findByIdAndUpdate(
            productObj.value.id,
            {
              overall_rating: newOverAllRatings,
            },
            { new: true },
          ),
        ]);
        if (
          reviewDoc.status === 'fulfilled' &&
          newProduct.status === 'fulfilled'
        ) {
          return reviewDoc.value;
        } else {
          throw new BadRequestException(
            'Somthing wrong with while creating review',
          );
        }
      } else {
        throw new BadRequestException('incorrect productid');
      }
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async getCountOfTheReview(id: string) {
    try {
      const count = await this.reviewModel
        .find({
          productId: id,
        })
        .countDocuments();
      return count + 2; // remember 2 reviews??
    } catch (e) {
      throw new BadRequestException('product id is does not exist');
    }
  }
  async getAllReviews(id: string) {
    try {
      return await this.reviewModel.find({
        productId: id,
      });
    } catch (e) {
      throw new BadRequestException('product id is does not exist');
    }
  }
}
