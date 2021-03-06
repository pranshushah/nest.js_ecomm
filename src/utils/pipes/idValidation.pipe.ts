import {
  PipeTransform,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
@Injectable()
export class ValidateId implements PipeTransform {
  transform(value: any) {
    if (isValidObjectId(value)) {
      return value;
    } else {
      throw new NotAcceptableException('invalid id');
    }
  }
}
