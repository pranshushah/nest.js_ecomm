import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/User/User.Service';
import { User } from 'src/User/User.model';

@Injectable()
export class CookieSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }
  serializeUser(user: User, done: (err: any, id?: any) => void) {
    done(undefined, user.id);
  }
  async deserializeUser(id: string, done: (err: any, id?: any) => void) {
    const user = await this.userService.gettingUserById(id);
    done(undefined, user.toJSON());
  }
}
