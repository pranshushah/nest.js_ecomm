import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './Auth.service';
import MockStrategy from '../utils/Mock/Google.mock';
import { googleMockProfile } from '../utils/Mock/Google.Mock.profile';
@Injectable()
export class GoogleMockStrategy extends PassportStrategy(
  MockStrategy,
  'google',
) {
  constructor(private authService: AuthService) {
    super({ name: 'google', user: googleMockProfile });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const userDoc = await this.authService.AddUserInDataBaseAndGetTheUserDocument(
      {
        googleId: profile.id,
        name: profile.displayName,
        email: profile._json.email as string,
        imageURL: profile._json.picture as string,
      },
    );
    //@ts-ignore
    done(undefined, userDoc);
  }
}
