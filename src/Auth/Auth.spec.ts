import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './Auth.controller';
import { AuthService } from './Auth.service';
import { CookieSerializer } from './CookieSerlizer';
import { GoogleMockStrategy } from './GoogleMock.strategy';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../User/User.model';
import { UserService } from '../User/User.Service';
import * as passport from 'passport';
import * as session from 'express-session';
import { cookieKey } from '../config/keys';

describe('goole-oauth', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;

  beforeEach(async () => {
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        PassportModule.register({ session: true }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        CookieSerializer,
        GoogleMockStrategy,
        UserService,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(
      session({
        secret: cookieKey,
        resave: true,
        cookie: {
          maxAge: 300 * 24 * 60 * 60 * 1000,
        },
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();
  });
  it('should login with google-oauth and return the cookie', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/auth/login')
      .expect(200);
    expect(res.get('Set-Cookie')).toBeDefined();
  });

  afterAll(async () => {
    await mongo.stop();
    await app.close();
  });
});
