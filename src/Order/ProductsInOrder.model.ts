import { Schema, Types, Document } from 'mongoose';

export interface ProductsInOrderAttr {
  productId: string;
  quantity: number;
  totalPrice: number;
}

export const productsInOrderSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      required: [true, 'product id required'],
      ref: 'Product',
    },
    title: {
      type: String,
      required: [true, 'product name is required'],
      validate: {
        validator(product_name: string) {
          return product_name.trim().length > 0;
        },
        message(message) {
          return `${message.value} is not valid product name`;
        },
      },
    },
    quantity: {
      type: Number,
      required: [true, 'quantity is required'],
      validate: {
        validator(quantity: number) {
          return quantity > 0;
        },
        message() {
          return `quantity should be poititve`;
        },
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'price is required'],
      validate: {
        validator(price: number) {
          return price > 0;
        },
        message() {
          return `price should be poititve`;
        },
      },
    },
  },
  {
    // to convert returning object as we want
    toJSON: {
      versionKey: false,
      transform(doc: ProductInOrder, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

export interface ProductInOrder extends ProductsInOrderAttr, Document {}
