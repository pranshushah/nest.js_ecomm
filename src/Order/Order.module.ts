import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { orderSchema } from './Order.model';
import { productsInOrderSchema } from './ProductsInOrder.model';
import { ProductSchema } from '../Product/Product.model';
import { OrderController } from './Order.controller';
import { OrderService } from './Order.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ProductsInOrder', schema: productsInOrderSchema },
      { name: 'Order', schema: orderSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
