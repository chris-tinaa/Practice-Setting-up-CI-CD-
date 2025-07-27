import { getWeather, getCityHistory, getWeatherAnalysis, exportWeatherData, adminLogin } from './weatherController';
import { Request, Response } from 'express';

describe('weatherController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;
  let setHeaderMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    sendMock = jest.fn();
    setHeaderMock = jest.fn();
    req = { query: {}, params: {}, body: {} };
    res = { json: jsonMock, status: statusMock, send: sendMock, setHeader: setHeaderMock };
  });

  it('should return 400 if city param missing in getWeather', async () => {
    await getWeather(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'City parameter is required' });
  });

  it('should return 400 if city param missing in getCityHistory', async () => {
    await getCityHistory(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'City parameter is required' });
  });

  it('should return 401 for invalid adminLogin', () => {
    req.body = { username: 'wrong', password: 'wrong' };
    adminLogin(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Invalid credentials' });
  });

  it('should return token for valid adminLogin', () => {
    req.body = { username: 'admin', password: 'admin123' };
    adminLogin(req as Request, res as Response);
    expect(jsonMock).toHaveBeenCalledWith({ success: true, token: expect.any(String) });
  });

  it('should exportWeatherData with missing city param', async () => {
    await exportWeatherData(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'City parameter is required' });
  });

  it('should handle error in getCityHistory', async () => {
    const req: any = { params: { city: 'X' }, query: { from: '2025-01-01' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    // Paksa getHistoricalWeather throw error
    const ctrl = require('./weatherController');
    const original = ctrl.getHistoricalWeather;
    ctrl.getHistoricalWeather = () => { throw new Error('fail'); };
    await ctrl.getCityHistory(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, error: 'fail' }));
    ctrl.getHistoricalWeather = original;
  });

  it('should handle error in getWeatherAnalysis', async () => {
    const req: any = { params: { city: 'X' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    // Paksa getDb().all error
    const db = require('./database');
    const originalGetDb = db.getDb;
    db.getDb = () => ({
      all: (q: string, cb: (err: any, rows: any[]) => void) => cb(new Error('fail'), [])
    });
    const ctrl = require('./weatherController');
    await ctrl.getWeatherAnalysis(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
    db.getDb = originalGetDb;
  });
});
