import { PipeTransform, Injectable } from '@nestjs/common';
import { AddressAttrWithoutUserID } from '../../Address/Address.model';

@Injectable()
export class AddressTrim implements PipeTransform {
  transform(value: AddressAttrWithoutUserID) {
    if (value.country) {
      value.country = value.country.trim();
    }
    if (value.deliveredTo) {
      value.deliveredTo = value.deliveredTo.trim();
    }
    if (value.state) {
      value.state = value.state.trim();
    }
    if (value.address) {
      value.address = value.address.trim();
    }
    if (value.city) {
      value.city = value.city.trim();
    }
    if (value.landMarks) {
      value.landMarks.forEach((landmark, index) => {
        value.landMarks[index] = landmark.trim();
      });
    }
    return value;
  }
}
