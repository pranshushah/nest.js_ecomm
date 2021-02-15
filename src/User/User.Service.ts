import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { UserDoc, userAttr } from './User.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDoc>,
  ) {}
  async AddUserIfDoesNotExist(user: userAttr) {
    const userDoc = await this.userModel.findOne({
      googleId: user.googleId,
    });
    if (userDoc) {
      return userDoc;
    } else {
      const newUserDoc = await new this.userModel(user).save();
      return newUserDoc;
    }
  }
  async gettingUserById(id: string) {
    try {
      if (isValidObjectId(id)) {
        const user = await this.userModel.findById(id);
        if (user) {
          return user;
        } else {
          throw new UnauthorizedException();
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
