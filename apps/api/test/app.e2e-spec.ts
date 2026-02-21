import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SignJWT } from 'jose';
import { AppModule } from '../src/app.module';

const TEST_SECRET = 'test-secret-for-e2e-min-32-chars!!';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? TEST_SECRET;
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET) should be public', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('OK');
  });

  it('/auth/me (GET) should require auth', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .expect(401);
  });

  it('/auth/login (POST) should return token', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com' })
      .expect(201)
      .expect((res: { body: Record<string, unknown> }) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });

  it('/auth/me (GET) with token should return user', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com' });
    
    const token = loginRes.body.accessToken;

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res: { body: Record<string, unknown> }) => {
        expect(res.body).toHaveProperty('userId');
        expect(res.body).toHaveProperty('tenantId');
      });
  });

  it('should reject forged token', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com' });
    const validToken = loginRes.body.accessToken;
    const forgedToken = validToken.slice(0, -5) + 'xxxxx';

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${forgedToken}`)
      .expect(401);
  });

  it('should reject token signed with wrong secret', async () => {
    const token = await new SignJWT({
      sub: '550e8400-e29b-41d4-a716-446655440000',
      tenantId: '660e8400-e29b-41d4-a716-446655440001',
      role: 'admin',
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(Math.floor(Date.now() / 1000))
      .setExpirationTime(Math.floor(Date.now() / 1000) + 3600)
      .sign(new TextEncoder().encode('wrong-secret-for-forgery-32-chars!!'));

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('should reject token with missing tenantId', async () => {
    const token = await new SignJWT({
      sub: '550e8400-e29b-41d4-a716-446655440000',
      role: 'admin',
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(Math.floor(Date.now() / 1000))
      .setExpirationTime(Math.floor(Date.now() / 1000) + 3600)
      .sign(new TextEncoder().encode(TEST_SECRET));

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('should reject expired token', async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = await new SignJWT({
      sub: '550e8400-e29b-41d4-a716-446655440000',
      tenantId: '660e8400-e29b-41d4-a716-446655440001',
      role: 'admin',
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(now - 7200)
      .setExpirationTime(now - 3600)
      .sign(new TextEncoder().encode(TEST_SECRET));

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
