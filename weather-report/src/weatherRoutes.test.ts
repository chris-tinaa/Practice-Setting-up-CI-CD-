import request from 'supertest';
import express from 'express';
import { weatherRoutes } from './weatherRoutes';

describe('weatherRoutes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/weather', weatherRoutes);

  it('should respond to GET /api/weather/current with 400 if no city', async () => {
    const res = await request(app).get('/api/weather/current');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should respond to POST /api/weather/admin/login with 401 for wrong credentials', async () => {
    const res = await request(app)
      .post('/api/weather/admin/login')
      .send({ username: 'x', password: 'y' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should respond to GET /api/weather/search', async () => {
    const res = await request(app).get('/api/weather/search?q=test');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('results');
  });
});
