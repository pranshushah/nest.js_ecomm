import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './Order.model';
import { ProductsInOrderAttr, ProductInOrder } from './ProductsInOrder.model';
import { Product } from '../Product/Product.model';
@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('ProductsInOrder')
    private readonly productInOrder: Model<ProductInOrder>,
  ) {}

  async addOrderTotheDatabase(
    productsWithQuantity: ProductsInOrderAttr[],
    userId: Types.ObjectId,
  ) {
    try {
      const productsWithQuantityDoc: ProductInOrder[] = [];
      for (const productWithQuantity of productsWithQuantity) {
        const product = await this.productModel.findById(
          productWithQuantity.productId,
        );
        if (product) {
          const productWithQuantityDoc = await new this.productInOrder({
            productId: product._id,
            quantity: productWithQuantity.quantity,
            title: product.product_name,
            totalPrice: product.final_price * productWithQuantity.quantity,
          }).save();
          productsWithQuantityDoc.push(productWithQuantityDoc);
        } else {
          throw new BadRequestException('invalid product');
        }
      }
      const order = await new this.orderModel({
        products: productsWithQuantityDoc,
        userId,
      }).save();
      return order;
    } catch (e) {
      throw new BadRequestException('somthing went wrong while creating order');
    }
  }

  async getAllOrdersFromDatabase(userId: Types.ObjectId) {
    return await this.orderModel.find({ userId });
  }

  async getOrder(id: string) {
    return this.orderModel.findOne({ _id: id });
  }
}
