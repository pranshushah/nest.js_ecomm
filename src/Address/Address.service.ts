import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc } from '../User/User.model';
import { Address, AddressAttrWithoutUserID } from './Address.model';

interface AddressAttrWithIdAndUserId extends AddressAttrWithoutUserID {
  id: string;
  userId: string;
}
@Injectable()
export class AddressService {
  constructor(
    @InjectModel('Address') private readonly addressModel: Model<Address>,
  ) {}
  async addAddressToDatabase(
    addressObj: AddressAttrWithoutUserID,
    userInfo: UserDoc,
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
    addressObj: AddressAttrWithIdAndUserId,
    userInfo: UserDoc,
  ) {
    try {
      if (addressObj.userId === userInfo.id.toString()) {
        const updatedAddress = await this.addressModel.findByIdAndUpdate(
          addressObj.id,
          { ...addressObj },
          { new: true },
        );
        if (updatedAddress) {
          return updatedAddress;
        } else {
          throw new NotFoundException('cannot update the with incorrect id');
        }
      } else {
        throw new BadRequestException('invalid address');
      }
    } catch (e) {
      throw new NotFoundException('somthing went wrong');
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
      return await this.addressModel.findOne({ userId, _id: id });
    } catch (e) {
      throw new BadRequestException('somthing went wrong');
    }
  }
}
