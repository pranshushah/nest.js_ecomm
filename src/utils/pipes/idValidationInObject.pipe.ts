import {
  PipeTransform,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
@Injectable()
export class ValidateIdInObject implements PipeTransform {
  transform(value: any) {
    if (isValidObjectId(value.id)) {
      return value;
    } else {
      throw new NotAcceptableException('invalid id in object');
    }
  }
}
