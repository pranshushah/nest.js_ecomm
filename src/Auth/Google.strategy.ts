import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { googleClientId, googleClientSecret } from '../config/keys';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: '/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    console.log(profile);
    const userDoc = await this.authService.AddUserInDataBaseAndGetTheUserDocument(
      {
        googleId: profile.id,
        name: profile.displayName,
        email: profile._json.email as string,
        imageURL: profile._json.picture as string,
      },
    );
    done(undefined, userDoc);
  }
}
