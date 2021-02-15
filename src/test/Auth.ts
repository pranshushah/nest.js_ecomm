import * as request from 'supertest';

export async function Auth(server: any) {
  const res = await request(server).get('/api/auth/login');
  return res.get('Set-Cookie');
}
