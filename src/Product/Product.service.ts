import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { timeoutMongooseQuery } from 'src/utils/helperFunction/timeout';
import { Product } from './Product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async getUniqueCategories() {
    try {
      const categories = await timeoutMongooseQuery<string[], Product>(
        this.productModel.distinct('product_category'),
      );
      return categories;
    } catch (e) {
      throw new InternalServerErrorException(
        'taking longer than expected please try later',
      );
    }
  }

  async getAllUniqueProductTitle() {
    try {
      const title: string[] = await timeoutMongooseQuery<string[], Product>(
        this.productModel.distinct('product_name'),
      );
      return title;
    } catch (e) {
      throw new InternalServerErrorException(
        'taking longer than expected please try later',
      );
    }
  }

  async getGivenNumberOfProductsFromGivenCategory(
    product_category: string,
    startIndexOfProduct: number,
  ) {
    try {
      const numberOfProducts = 8;
      const products = await timeoutMongooseQuery<Product[], Product>(
        this.productModel
          .find({ product_category })
          .sort({ overall_rating: -1, final_price: 1 })
          .skip(startIndexOfProduct)
          .limit(numberOfProducts),
      );
      return products;
    } catch (e) {
      throw new InternalServerErrorException(
        'taking longer than expected please try later',
      );
    }
  }

  // private createProduct(productObj: ProductAttr) {
  //   return new this.productModel(productObj);
  // }
  // async SeedProduct() {
  //   const rawData = readFileSync('/home/pranshu/projects/csv/converted.json');
  //   //@ts-ignore
  //   const productArr: ProductAttr[] = JSON.parse(rawData);
  //   for (const productObj of productArr) {
  //     await this.createProduct(productObj).save();
  //   }
  //   return productArr.length;
  // }
}
