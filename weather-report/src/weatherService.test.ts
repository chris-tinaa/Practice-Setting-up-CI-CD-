import { getWeatherForCity, getHistoricalWeather, processAndAnalyzeWeatherData } from './weatherService';
import { WeatherData } from './weatherModel';

describe('weatherService', () => {
  it('should return mock weather data for a city', async () => {
    const data = await getWeatherForCity('Jakarta');
    expect(data).toHaveProperty('city', 'Jakarta');
    expect(typeof data.temperature).toBe('number');
    expect(typeof data.conditions).toBe('string');
    expect(typeof data.humidity).toBe('number');
    expect(typeof data.wind_speed).toBe('number');
    expect(typeof data.date_recorded).toBe('string');
  });

  it('should process and analyze weather data', () => {
    const mockData: WeatherData[] = [
      { city: 'Jakarta', temperature: 30, conditions: 'Sunny', humidity: 70, wind_speed: 10, date_recorded: '2025-07-27T00:00:00Z' },
      { city: 'Jakarta', temperature: 25, conditions: 'Rainy', humidity: 90, wind_speed: 20, date_recorded: '2025-07-26T00:00:00Z' },
      { city: 'Jakarta', temperature: 20, conditions: 'Cloudy', humidity: 60, wind_speed: 5, date_recorded: '2025-07-25T00:00:00Z' }
    ];
    const result = processAndAnalyzeWeatherData(mockData);
    expect(result.temperature.high).toBe(30);
    expect(result.temperature.low).toBe(20);
    expect(result.humidity.high).toBe(90);
    expect(result.humidity.low).toBe(60);
    expect(result.wind_speed.high).toBe(20);
    expect(result.wind_speed.low).toBe(5);
    expect(typeof result.summary).toBe('string');
  });

  it('should get historical weather data (mocked, no error)', async () => {
    // This test just checks that the function returns an array or error is handled
    const data = await getHistoricalWeather('Jakarta');
    expect(Array.isArray(data)).toBe(true);
  });

  it('should throw error in getWeatherForCity if something fails', async () => {
    // Simulasikan error dengan memodifikasi saveWeatherData agar throw
    const originalConsole = console.error;
    console.error = jest.fn();
    const original = (global as any).saveWeatherData;
    (global as any).saveWeatherData = () => { throw new Error('fail'); };
    let error;
    try {
      await getWeatherForCity('ErrorCity');
    } catch (e: any) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message).toMatch(/Failed to get weather/);
    // Restore
    (global as any).saveWeatherData = original;
    console.error = originalConsole;
  });

  it('should reject getHistoricalWeather on db error', async () => {
    // Simulasikan error pada db.all
    const db = require('./database');
    const originalGetDb = db.getDb;
    db.getDb = () => ({
      all: (q: string, cb: (err: any, rows: any[]) => void) => cb(new Error('db error'), [])
    });
    let error;
    try {
      await getHistoricalWeather('ErrorCity');
    } catch (e: any) {
      error = e;
    }
    expect(error).toBeDefined();
    db.getDb = originalGetDb;
  });

  it('should generate correct weather summary for edge cases', () => {
    // Very hot, very humid, very windy
    const summary1 = (processAndAnalyzeWeatherData as any)([
      { city: 'A', temperature: 35, humidity: 90, wind_speed: 40 }
    ]).summary;
    expect(summary1).toMatch(/Very hot/);
    expect(summary1).toMatch(/Very humid/);
    expect(summary1).toMatch(/Very windy/);

    // Cold, dry, calm
    const summary2 = (processAndAnalyzeWeatherData as any)([
      { city: 'B', temperature: 5, humidity: 30, wind_speed: 5 }
    ]).summary;
    expect(summary2).toMatch(/Cold/);
    expect(summary2).toMatch(/Dry/);
    expect(summary2).toMatch(/Calm winds/);

    // Windy, humid, mild
    const summary3 = (processAndAnalyzeWeatherData as any)([
      { city: 'C', temperature: 15, humidity: 70, wind_speed: 20 }
    ]).summary;
    expect(summary3).toMatch(/Mild/);
    expect(summary3).toMatch(/Humid/);
    expect(summary3).toMatch(/Windy/);
  });
});
