/* eslint-disable @typescript-eslint/no-empty-interface */
import { userInfo } from '../../src/User/User.model';
export {};

declare global {
  namespace Express {
    interface User extends userInfo {}
  }
}
