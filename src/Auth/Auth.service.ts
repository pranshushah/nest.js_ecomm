import { Injectable } from '@nestjs/common';
import { UserService } from '../User/User.Service';
import { userAttr } from '../User/User.model';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async AddUserInDataBaseAndGetTheUserDocument(user: userAttr) {
    return await this.userService.AddUserIfDoesNotExist(user);
  }
}
