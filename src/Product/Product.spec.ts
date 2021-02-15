import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ProductController } from './Product.controller';
import { ProductService } from './Product.service';
import { ProductSchema } from './Product.model';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createProducts } from '../test/CreateProduct';

describe('Product', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;

  beforeEach(async () => {
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
      ],
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('should send all products', async () => {
    const server = app.getHttpServer();
    const [res] = await createProducts(server);
    expect(res).toBe(10);
  });

  it('should get all titles', async () => {
    const server = app.getHttpServer();
    await createProducts(server);
    const res = await request(server).get('/api/products/titles').expect(200);
    const titles = [
      'Alfajr WQ18 Qibla Compass Digital Watch  - For Men, Boys, Girls',
      'Belle Gambe Winter Boots',
      'Kool Kidz DMK-003-YL 03 Analog Watch  - For Girls, Boys',
      'Ladela Bellies',
      "Peppermint Blues Casual Sleeveless Printed Women's Top",
      "PrettyPataka Party Full Sleeve Woven Women's Top",
      'Q&Q VQ13-008 Analog Watch  - For Girls, Boys',
      'Rorlig RR-028 Expedition Analog Watch  - For Men, Boys',
      'Skmei 1070BLK Sports Analog-Digital Watch  - For Men, Boys',
      'Steppings Trendy Boots',
    ];

    expect(res.body.titles).toEqual(titles);
  });

  it('should get categories', async () => {
    const server = app.getHttpServer();
    await createProducts(server);
    const res = await request(server)
      .get('/api/products/categories')
      .expect(200);
    const categories = ['Clothing', 'Footwear', 'Watches'];
    expect(res.body.categories).toEqual(categories);
  });

  it('returns number of products in given category', async () => {
    const server = app.getHttpServer();
    await createProducts(server);
    const res = await request(server)
      .get('/api/products/categories/Footwear/count')
      .expect(200);
    expect(res.body.count).toBe(3);
  });

  it('returns producs in batch of 8', async () => {
    const server = app.getHttpServer();
    await createProducts(server);
    const res = await request(server)
      .get('/api/products/categories/Watches?start=1')
      .expect(200);
    expect(res.body.products.length).toBe(4);
  });

  it('returns data about single product', async () => {
    const server = app.getHttpServer();
    const [, products] = await createProducts(server);

    const res = await request(server)
      .get(`/api/products/${products[0].id}`)
      .expect(200);

    expect(res.body.product.brand).toBe('Ladela');
    expect(res.body.product.product_category).toBe('Footwear');
    expect(res.body.product.product_name).toBe('Ladela Bellies');
  });

  afterAll(async () => {
    await mongo.stop();
    await app.close();
  });
});
