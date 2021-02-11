import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './Product.service';
import { ValidateId } from '../utils/pipes/idValidation.pipe';
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

  @Get('categories/:categoryName/count')
  async countOfTotalProducts(@Param('categoryName') category: string) {
    const count = await this.productService.getCountOfTheGivenCategory(
      category,
    );
    return { count };
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

  @Get(':productId')
  async getProduct(@Param('productId', ValidateId) pId: string) {
    const product = await this.productService.getProductFromId(pId);
    return { product };
  }
}
