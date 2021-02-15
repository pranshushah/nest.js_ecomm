import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../Auth/Auth.controller';
import { AuthService } from '../Auth/Auth.service';
import { CookieSerializer } from '../Auth/CookieSerlizer';
import { GoogleMockStrategy } from '../Auth/GoogleMock.strategy';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../User/User.model';
import { UserService } from '../User/User.Service';
import * as passport from 'passport';
import * as session from 'express-session';
import { cookieKey } from '../config/keys';
import { AddressController } from './Address.Controller';
import { AddressService } from './Address.service';
import { AddressSchema } from './Address.model';
import { Auth } from '../test/Auth';

describe('goole-oauth', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Address', schema: AddressSchema }]),
        PassportModule.register({ session: true }),
      ],
      controllers: [AuthController, AddressController],
      providers: [
        AuthService,
        CookieSerializer,
        GoogleMockStrategy,
        UserService,
        AddressService,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(
      session({
        secret: cookieKey,
        resave: true,
        saveUninitialized: true,
        cookie: {
          maxAge: 300 * 24 * 60 * 60 * 1000,
        },
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();
  });
  it('Should create address document', async () => {
    const server = app.getHttpServer();
    const cookie = await Auth(server);
    const res = await request(server)
      .post('/api/address')
      .send({
        pincode: 395009,
        address:
          ' A-2/301 center point,opposite sagar complex,anand mahal raod  ',
        city: ' surat ',
        state: ' Gujrat ',
        country: ' India ',
        deliveredTo: '   pranshu shah    ',
        landMarks: ['  sagar Complex', 'green Aliena  '],
      })
      .set('Cookie', cookie)
      .expect(201);
    const subset = {
      landMarks: ['sagar Complex', 'green Aliena'],
      pincode: 395009,
      address: 'A-2/301 center point,opposite sagar complex,anand mahal raod',
      city: 'surat',
      state: 'Gujrat',
      country: 'India',
      deliveredTo: 'pranshu shah',
    };
    expect(res.body.address).toMatchObject(subset);
  });

  it('Should throw error because not authenticated address document', async () => {
    const server = app.getHttpServer();
    await request(server)
      .post('/api/address')
      .send({
        pincode: 395009,
        address:
          ' A-2/301 center point,opposite sagar complex,anand mahal raod  ',
        city: ' surat ',
        state: ' Gujrat ',
        country: ' India ',
        deliveredTo: '   pranshu shah    ',
        landMarks: ['  sagar Complex', 'green Aliena  '],
      })
      .expect(401);
  });
  it('Should edit address document', async () => {
    const server = app.getHttpServer();
    const cookie = await Auth(server);
    const res = await request(server)
      .post('/api/address')
      .send({
        pincode: 395009,
        address:
          ' A-2/301 center point,opposite sagar complex,anand mahal raod  ',
        city: ' surat ',
        state: ' Gujrat ',
        country: ' India ',
        deliveredTo: '   pranshu shah    ',
        landMarks: ['  sagar Complex', 'green Aliena  '],
      })
      .set('Cookie', cookie)
      .expect(201);
    const res1 = await request(server)
      .patch('/api/address')
      .set('Cookie', cookie)
      .send({
        ...res.body.address,
        landMarks: ['surat khaman'],
      })
      .expect(200);
    const subset = {
      landMarks: ['surat khaman'],
      pincode: 395009,
      address: 'A-2/301 center point,opposite sagar complex,anand mahal raod',
      city: 'surat',
      state: 'Gujrat',
      country: 'India',
      deliveredTo: 'pranshu shah',
    };
    expect(res1.body.address).toMatchObject(subset);
  });

  it('Should not edit address because not authenticted document', async () => {
    const server = app.getHttpServer();
    const cookie = await Auth(server);
    const res = await request(server)
      .post('/api/address')
      .send({
        pincode: 395009,
        address:
          ' A-2/301 center point,opposite sagar complex,anand mahal raod  ',
        city: ' surat ',
        state: ' Gujrat ',
        country: ' India ',
        deliveredTo: '   pranshu shah    ',
        landMarks: ['  sagar Complex', 'green Aliena  '],
      })
      .set('Cookie', cookie)
      .expect(201);

    await request(server)
      .patch('/api/address')
      .send({
        ...res.body.address,
        landMarks: ['surat khaman'],
      })
      .expect(401);
  });

  it('Should get all addresses document', async () => {
    const server = app.getHttpServer();
    const cookie = await Auth(server);

    const res = await request(server)
      .get('/api/address/all')
      .set('Cookie', cookie)
      .expect(200);

    // i have created address 3 times with current user in previous tests.
    expect(res.body.addresses.length).toBe(3);
  });

  it('Should throw error when not authenticated', async () => {
    const server = app.getHttpServer();
    await request(server).get('/api/address/all').expect(401);
  });

  it('should get single address from id', async () => {
    const server = app.getHttpServer();
    const cookie = await Auth(server);
    const subset = {
      landMarks: ['surat khaman'],
      pincode: 395009,
      address: 'A-2/301 center point,opposite sagar complex,anand mahal raod',
      city: 'surat',
      state: 'Gujrat',
      country: 'India',
      deliveredTo: 'pranshu shah',
    };
    const res = await request(server)
      .post('/api/address')
      .send(subset)
      .set('Cookie', cookie);
    const res1 = await request(server)
      .get(`/api/address/${res.body.address.id}`)
      .set('Cookie', cookie);

    expect(res1.body.address).toMatchObject(subset);
  });

  it('should not autherize if not logged, for address from id', async () => {
    const server = app.getHttpServer();
    const cookie = await Auth(server);
    const subset = {
      landMarks: ['surat khaman'],
      pincode: 395009,
      address: 'A-2/301 center point,opposite sagar complex,anand mahal raod',
      city: 'surat',
      state: 'Gujrat',
      country: 'India',
      deliveredTo: 'pranshu shah',
    };
    const res = await request(server)
      .post('/api/address')
      .send(subset)
      .set('Cookie', cookie);
    const res1 = await request(server)
      .get(`/api/address/${res.body.address.id}`)
      .expect(401);
  });

  afterAll(async () => {
    await mongo.stop();
    await app.close();
  });
});
