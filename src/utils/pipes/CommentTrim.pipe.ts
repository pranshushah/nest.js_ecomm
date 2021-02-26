import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { reviewAttrWithoutUserID } from '../../Review/Review.model';
import { isValidObjectId } from 'mongoose';
@Injectable()
export class CommentTrim implements PipeTransform {
  transform(value: reviewAttrWithoutUserID) {
    if (value.comment) {
      value.comment = value.comment.trim();
    }
    if (!isValidObjectId(value.productId)) {
      throw new BadRequestException('invalid product id');
    }

    return value;
  }
}
