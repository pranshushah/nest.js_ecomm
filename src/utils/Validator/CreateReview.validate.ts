import {
  IsInt,
  Max,
  Min,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
export class CreateReview {
  @IsInt()
  @Max(5)
  @Min(1)
  stars: 5 | 4 | 3 | 2 | 1;

  productId: string;

  @IsNotEmpty()
  @IsOptional()
  @MinLength(1)
  comment: string;
}
