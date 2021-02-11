import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
@Injectable()
export class ValidateId implements PipeTransform {
  transform(value: any) {
    if (isValidObjectId(value)) {
      return value;
    } else {
      throw new NotFoundException('invalid id');
    }
  }
}
