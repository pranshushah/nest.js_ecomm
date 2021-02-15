import { Strategy } from 'passport';

export type doneFunction = (
  error: Error | null | undefined,
  user?: Record<string | number, any>,
  info?: any,
) => void;

interface callBackFunction {
  (
    accessToken: string,
    refreshToken: string,
    profile: Record<string | number, any>,
    done: doneFunction,
  ): void;
}

interface MockStrategyOptions {
  name: string;
  user: Record<string | number, any>;
}

export default class MockStrategy extends Strategy {
  _user: Record<string | number, any>;
  name: string;
  cb: callBackFunction;
  constructor(options: MockStrategyOptions, callback: callBackFunction) {
    super();
    this._user = options.user;
    this.name = options.name;
    this.cb = callback;
  }
  public authenticate() {
    try {
      this.cb('accessToken', 'refreshToken', this._user, (err, user, info) => {
        if (err) {
          return this.error(err);
        }
        if (!user) {
          return this.fail(info);
        }
        this.success(user, info);
      });
    } catch (e) {
      this.error(e);
    }
  }
}
