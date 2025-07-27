import { WeatherData, UsrPrefs, UserSettings, OldWeatherFormat } from './weatherModel';

describe('weatherModel', () => {
  it('should create a WeatherData object', () => {
    const data: WeatherData = {
      city: 'Jakarta',
      temperature: 30,
      conditions: 'Sunny',
      humidity: 70,
      wind_speed: 10,
      date_recorded: '2025-07-27T00:00:00Z',
    };
    expect(data.city).toBe('Jakarta');
    expect(data.temperature).toBe(30);
    expect(data.conditions).toBe('Sunny');
  });

  it('should create a UsrPrefs object', () => {
    const prefs: UsrPrefs = {
      usrId: 1,
      favoriteCity: 'Bandung',
      tempratureUnit: 'C',
      notificationsEnabled: true,
    };
    expect(prefs.favoriteCity).toBe('Bandung');
    expect(prefs.tempratureUnit).toBe('C');
  });

  it('should create a UserSettings object', () => {
    const settings: UserSettings = {
      userId: 2,
      defaultCity: 'Surabaya',
      tempUnit: 'F',
      notifications: false,
    };
    expect(settings.defaultCity).toBe('Surabaya');
    expect(settings.tempUnit).toBe('F');
  });

  it('should create an OldWeatherFormat object', () => {
    const old: OldWeatherFormat = {
      cityName: 'Medan',
      temp: 28,
      sky_condition: 'Cloudy',
      humidity_percentage: 80,
      wind: { speed: 12, direction: 'NE' },
      recorded: new Date('2025-07-27T00:00:00Z'),
    };
    expect(old.cityName).toBe('Medan');
    expect(old.wind.direction).toBe('NE');
  });
});
