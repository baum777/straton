import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import request from 'supertest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** E2E: Start built API server and test auth. Uses real built app to avoid vitest/esbuild decorator metadata issues. */
describe('API Auth Guard', () => {
  let serverProcess: ChildProcess | null = null;
  const baseUrl = 'http://localhost:3002';

  beforeAll(async () => {
    const apiDir = join(__dirname, '../..');
    serverProcess = spawn('node', ['dist/main.js'], {
      cwd: apiDir,
      env: { ...process.env, PORT: '3002' },
      stdio: 'pipe',
    });
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('Server timeout')), 10000);
      const check = () => {
        request(baseUrl)
          .get('/api/health')
          .then((r) => {
            if (r.status === 200) {
              clearTimeout(t);
              resolve();
            } else setTimeout(check, 100);
          })
          .catch(() => setTimeout(check, 100));
      };
      setTimeout(check, 500);
    });
  });

  afterAll(() => {
    serverProcess?.kill();
  });

  it('GET /api/health returns 200 without token (public)', async () => {
    const res = await request(baseUrl).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/auth/login returns 200 without token (public)', async () => {
    const res = await request(baseUrl)
      .post('/api/auth/login')
      .send({ email: 'x@x.com', password: 'x' });
    expect(res.status).toBe(200);
    expect(res.body.access_token).toBeDefined();
  });

  it('POST /api/auth/me returns 401 without token', async () => {
    const res = await request(baseUrl).post('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/me returns 200 with valid token', async () => {
    const loginRes = await request(baseUrl)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'test' });
    const token = loginRes.body.access_token;
    const res = await request(baseUrl)
      .post('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('demo-user-id');
    expect(res.body.tenantId).toBe('demo-tenant-id');
    expect(res.body.role).toBe('admin');
  });

  it('rejects invalid token', async () => {
    const res = await request(baseUrl)
      .post('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
  });
});
