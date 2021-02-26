import { Schema, Types, Document } from 'mongoose';

export const ReviewSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: [true, 'userid is required'],
      ref: 'User',
    },
    productId: {
      type: Types.ObjectId,
      required: [true, 'product id required'],
      ref: 'Product',
    },
    stars: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: [true, 'stars is required'],
    },
    comment: {
      type: String,
      validate: {
        validator(review: string) {
          return review.trim().length > 0;
        },
        message(message) {
          return `${message.value} is not valid review`;
        },
      },
    },
  },
  {
    // to convert returning object as we want
    toJSON: {
      versionKey: false,
      transform(doc: Review, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

export interface reviewAttrWithoutUserID {
  productId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

export interface reviewAttr extends reviewAttrWithoutUserID {
  userId: string;
}

export interface Review extends reviewAttr, Document {}
