import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './Product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Post('seed')
  // async SeedProductData() {
  //   return await this.productService.SeedProduct();
  // }

  @Get('categories')
  async getAllCategories() {
    const categories = await this.productService.getUniqueCategories();
    return { categories };
  }

  @Get('titles')
  async getAllTitle() {
    const titles = await this.productService.getAllUniqueProductTitle();
    return { titles };
  }

  @Get('categories/:categoryName')
  async getProductsInGivenCategory(
    @Param('categoryName') categoryName: string,
    @Query('start') startIndexOfProduct: string,
  ) {
    const numberStartIndex = isNaN(parseInt(startIndexOfProduct))
      ? 0
      : parseInt(startIndexOfProduct);
    const products = await this.productService.getGivenNumberOfProductsFromGivenCategory(
      categoryName,
      numberStartIndex,
    );
    return { products };
  }
}
