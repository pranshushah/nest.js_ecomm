import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { timeoutMongooseQuery } from '../utils/helperFunction/timeout';
import { Product, ProductAttr } from './Product.model';

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
      throw new RequestTimeoutException(
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
      throw new RequestTimeoutException(
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
      throw new RequestTimeoutException(
        'taking longer than expected please try later',
      );
    }
  }

  async getProductFromId(id: string) {
    try {
      const product = await timeoutMongooseQuery<Product, Product>(
        this.productModel.findById(id),
      );
      if (product) {
        return product;
      } else {
        throw new NotFoundException('product not found');
      }
    } catch (e) {
      throw new RequestTimeoutException(
        'taking longer than expected please try later',
      );
    }
  }

  async getCountOfTheGivenCategory(category: string) {
    try {
      const count = await this.productModel
        .find({ product_category: category })
        .countDocuments();
      return count;
    } catch (e) {
      throw new RequestTimeoutException(
        'taking longer than expected please try later',
      );
    }
  }

  async addProductsToTest(productObjs: ProductAttr[]) {
    const docs: Product[] = [];
    if (process.env.NODE_ENV === 'test') {
      for (const productObj of productObjs) {
        const doc = await new this.productModel(productObj).save();
        docs.push(doc);
      }
    } else {
      throw new ForbiddenException('you are not allowed');
    }
    return docs;
  }
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
