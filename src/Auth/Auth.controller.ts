import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from 'src/utils/Guards/Authenticated.guard';
import { LoginGuard } from 'src/utils/Guards/Login.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LoginGuard)
  @Get('login')
  login() {}

  @UseGuards(AuthenticatedGuard)
  @Get('current')
  getCurrentUser(@Req() req: Request) {
    return { user: req.user };
  }
  @Get('google/callback')
  @UseGuards(LoginGuard)
  CallBack(@Res() res: Response) {
    res.redirect('/api/auth/current');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    req.logOut();
    return { loggedOut: true };
  }
}
