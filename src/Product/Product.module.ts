import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './Product.model';
import { ProductController } from './Product.controller';
import { ProductService } from './Product.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
