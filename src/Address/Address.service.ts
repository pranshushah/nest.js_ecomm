import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userInfo } from '../User/User.model';
import { Address, AddressAttrWithoutUserID } from './Address.model';

interface AddressAttrWithIdButWithoutUserID extends AddressAttrWithoutUserID {
  id: string;
}
@Injectable()
export class AddressService {
  constructor(
    @InjectModel('Address') private readonly addressModel: Model<Address>,
  ) {}
  async addAddressToDatabase(
    addressObj: AddressAttrWithoutUserID,
    userInfo: userInfo,
  ) {
    try {
      const address = await new this.addressModel({
        ...addressObj,
        userId: userInfo.id,
      }).save();
      return address;
    } catch (e) {
      throw new NotAcceptableException(e);
    }
  }
  async editAddressToDatabase(
    addressObj: AddressAttrWithIdButWithoutUserID,
    userInfo: userInfo,
  ) {
    try {
      const updatedAddress = await this.addressModel.findByIdAndUpdate(
        addressObj.id,
        { ...addressObj, userId: userInfo.id },
        { new: true },
      );
      if (updatedAddress) {
        return updatedAddress;
      } else {
        throw new NotFoundException('cannot update the with incorrect id');
      }
    } catch (e) {
      throw new NotFoundException('cannot update the with incorrect id');
    }
  }
  async getAllAddressFromDatabase(userId: string) {
    try {
      return await this.addressModel.find({ userId: userId });
    } catch (e) {
      throw new BadRequestException('somthing went wrong');
    }
  }
  async getAddressfromDatabase(id: string, userId: string) {
    try {
      return await this.addressModel.find({ userId: userId, id: id });
    } catch (e) {
      throw new BadRequestException('somthing went wrong');
    }
  }
}
