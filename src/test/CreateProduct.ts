import * as request from 'supertest';
import { products } from '../utils/data/Product';

export async function createProducts(server: any) {
  const res = await request(server)
    .post('/api/products/add')
    .send({ products });
  return [res.body.products.length, res.body.products];
}
