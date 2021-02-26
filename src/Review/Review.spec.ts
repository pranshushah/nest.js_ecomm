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
import { Product, ProductSchema } from '../Product/Product.model';
import { ReviewSchema } from '../Review/Review.model';
import { UserService } from '../User/User.Service';
import * as passport from 'passport';
import * as session from 'express-session';
import { cookieKey } from '../config/keys';
import { Auth } from '../test/Auth';
import { ReviewController } from './Review.Controller';
import { ReviewService } from './Review.service';
import { ProductController } from '../Product/Product.controller';
import { ProductService } from '../Product/Product.service';
import { createProducts } from '../test/CreateProduct';

describe('Address', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;
  let cookie: string[];
  let products: Product[];
  let id: string;
  let server: any;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([
          { name: 'User', schema: UserSchema },
          { name: 'Product', schema: ProductSchema },
          { name: 'Review', schema: ReviewSchema },
        ]),
        PassportModule.register({ session: true }),
      ],
      controllers: [AuthController, ReviewController, ProductController],
      providers: [
        AuthService,
        ReviewService,
        CookieSerializer,
        GoogleMockStrategy,
        UserService,
        ProductService,
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

    server = app.getHttpServer();
    const [res, productsArr] = await createProducts(server);
    expect(res).toBe(10);
    cookie = await Auth(server);
    products = productsArr;
  });

  it('should create Review', async () => {
    const review = {
      stars: 4,
      productId: products[0].id,
      comment: 'mast product',
    };
    id = products[0].id;
    const server = app.getHttpServer();
    const res = await request(server)
      .post('/api/review')
      .send(review)
      .set('Cookie', cookie);
    expect(res.body).toMatchObject(review);
  });

  it('should not let review the product if i am not authenticated', async () => {
    const review = {
      stars: 4,
      productId: products[0].id,
      comment: 'mast product',
    };
    const server = app.getHttpServer();
    await request(server).post('/api/review').send(review).expect(401);
  });

  it('should return number of reviews in Product', async () => {
    const res = await request(server)
      .get(`/api/review/count/${id}`)
      .set('Cookie', cookie);
    expect(res.body.count).toBe(3);
  });

  it('should throw error if we pass wrong productid for count of reviews', async () => {
    await request(server)
      .get(`/api/review/count/1234`)
      .set('Cookie', cookie)
      .expect(406);
  });

  it('should return the array of reviews for given product', async () => {
    const res = await request(server)
      .get(`/api/review/${id}`)
      .set('Cookie', cookie);
    expect(res.body.reviews.length).toBe(1);
  });

  it('should throw error if we pass wrong productid for count of reviews', async () => {
    await request(server)
      .get(`/api/review/1234`)
      .set('Cookie', cookie)
      .expect(406);
  });

  afterAll(async () => {
    await mongo.stop();
    await app.close();
  });
});
