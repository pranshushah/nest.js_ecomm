import {
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';
export class EditAddress {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  pincode: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(74)
  country: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(74)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(44)
  deliveredTo: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(74)
  state: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(119)
  address: string;

  @IsArray()
  @MinLength(2, { each: true })
  @MaxLength(45, { each: true })
  landMarks: string[];

  @IsString()
  @IsNotEmpty()
  id: string;
}
