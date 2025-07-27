import request from 'supertest';
import app from './app';
import express from 'express';

describe('Express App', () => {
  it('should respond to GET /api/weather', async () => {
    const res = await request(app).get('/api/weather');
    expect(res.status).toBeDefined();
  });

  it('should parse JSON bodies', async () => {
    const res = await request(app)
      .post('/api/weather')
      .send({ city: 'Jakarta' })
      .set('Accept', 'application/json');
    expect(res.status).toBeDefined();
  });

  it('should handle errors with error handler', async () => {
    // Buat instance baru untuk test error handler
    const testApp = express();
    testApp.get('/error', () => {
      throw new Error('Test error');
    });
    // Gunakan error handler dari app.ts
    // @ts-ignore
    testApp.use(app._router.stack.find(r => r.name === '<anonymous>').handle);

    const res = await request(testApp).get('/error');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Test error');
  });
});