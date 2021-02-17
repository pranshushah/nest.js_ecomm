import { IsArray, ValidateNested } from 'class-validator';
import { ProductsInOrderAttr } from '../../Order/ProductsInOrder.model';
export class CreateOrderValidator {
  @IsArray()
  @ValidateNested()
  products: ProductsInOrderAttr[];
}
