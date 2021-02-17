import { Schema, Types, Document } from 'mongoose';
import { productsInOrderSchema, ProductInOrder } from './ProductsInOrder.model';

export const orderSchema = new Schema(
  {
    // userId: {
    //   type: Types.ObjectId,
    //   required: [true, 'userId is required'],
    //   ref: 'User',
    // },
    products: {
      type: [productsInOrderSchema],
      required: [true, 'produts are required'],
    },
  },
  {
    // to convert returning object as we want
    toJSON: {
      versionKey: false,
      transform(doc: Order, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

orderSchema.virtual('finalTotalPrice').get(function () {
  if (Array.isArray(this.products)) {
    let amount;
    for (let i = 0; i < this.products.length; i++) {
      amount += this.products[i].price;
    }
    return amount;
  } else {
    return 0;
  }
});

interface orderAttr {
  userId: Types.ObjectId;
  products: ProductInOrder[];
  finalTotalPrice: number;
}

export interface Order extends orderAttr, Document {}
