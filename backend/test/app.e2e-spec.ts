import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Auth (e2e)', () => {
    it('POST /auth/register - should register a new advisor', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'E2E Test Advisor',
          email: `e2e-${Date.now()}@test.com`,
          password: 'testpassword123',
          phone: '1234567890',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('advisor');
          expect(res.body).toHaveProperty('accessToken');
        });
    });

    it('POST /auth/login - should login with valid credentials', async () => {
      // First register
      const registerRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'E2E Login Test',
          email: `e2e-login-${Date.now()}@test.com`,
          password: 'testpassword123',
          phone: '1234567890',
        });

      const email = registerRes.body.advisor.email;

      // Then login
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password: 'testpassword123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('advisor');
          expect(res.body).toHaveProperty('accessToken');
        });
    });

    it('POST /auth/login - should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Clients (e2e)', () => {
    let authToken: string;

    beforeAll(async () => {
      // Register and get token
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'E2E Client Test',
          email: `e2e-client-${Date.now()}@test.com`,
          password: 'testpassword123',
          phone: '1234567890',
        });

      authToken = res.body.accessToken;
    });

    it('GET /clients - should return clients with auth', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /clients - should fail without auth', () => {
      return request(app.getHttpServer()).get('/clients').expect(401);
    });
  });
});
