import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/User/User.Module';
import { AuthController } from './Auth.controller';
import { AuthService } from './Auth.service';
import { CookieSerializer } from './CookieSerlizer';
import { GoogleStrategy } from './Google.strategy';
@Module({
  imports: [UserModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, CookieSerializer, GoogleStrategy],
})
export class AuthModule {}
