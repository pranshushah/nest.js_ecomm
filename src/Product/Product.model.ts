import { Schema, Document } from 'mongoose';

export const ProductSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      validate: {
        validator(product_name: string) {
          return product_name.trim().length > 0;
        },
        message(message) {
          return `${message.value} is not valid product name`;
        },
      },
    },
    retail_price: {
      type: Number,
      required: true,
      validate: {
        validator(price: number) {
          return price > 0;
        },
        message() {
          return `price should be positive`;
        },
      },
    },
    discounted_price: {
      type: Number,
      validate: {
        validator(discounted_price: number) {
          return discounted_price > 0 && discounted_price <= this.retail_price;
        },
        message() {
          return `discounted price should be positive or less than retail price`;
        },
      },
    },
    image: { type: String, required: true },
    description: {
      type: String,
      required: true,
      validate: {
        validator(description: string) {
          return description.trim().length > 0;
        },
        message(message) {
          return `${message.value} is not valid description`;
        },
      },
    },
    overall_rating: { type: Number, required: true },
    product_category: {
      type: String,
      required: true,
      validate: {
        validator(product_category: string) {
          return product_category.trim().length > 0;
        },
        message(message) {
          return `${message.value} is not valid product category`;
        },
      },
    },
    brand: { type: String },
  },
  {
    // to convert returning object as we want
    toJSON: {
      versionKey: false,
      transform(doc: Product, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

ProductSchema.virtual('final_price').get(function () {
  if (this.discounted_price) {
    return this.discounted_price;
  } else {
    return this.retail_price;
  }
});

export interface ProductAttr {
  product_name: string;
  description: string;
  retail_price: number;
  discounted_price?: number;
  overall_rating: number;
  product_category: string;
  image: string;
  brand?: string;
  final_price: number;
}

export interface Product extends Document, ProductAttr {}
