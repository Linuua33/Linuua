export const CWB_API_URL = import.meta.env.PROD
  ? 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001'
  : '/api-cwa/api/v1/rest/datastore/F-C0032-001';

export const LOCAL_WEATHER_URL = '/weather-data.json';

export type WeatherElement = {
  elementName: string;
  time: Array<{ parameter: { parameterName: string } }>;
};

export type LocationData = {
  locationName: string;
  weatherElement: WeatherElement[];
  [key: string]: any;
};

export async function fetchCwbWeatherData(locationName: string, apiKey: string): Promise<LocationData> {
  const params = new URLSearchParams({
    Authorization: apiKey,
    locationName,
    elementName: 'Wx,PoP,MinT,CI',
    format: 'JSON'
  });

  const res = await fetch(`${CWB_API_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`CWB weather request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const locData = data.records?.location?.[0];
  if (!locData) {
    throw new Error('CWB weather data missing location');
  }

  return locData as LocationData;
}

export async function fetchLocalWeatherData(locationName: string): Promise<LocationData> {
  const res = await fetch(LOCAL_WEATHER_URL);
  if (!res.ok) {
    throw new Error(`Local weather JSON request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const locData = data.locations?.[locationName];
  if (!locData) {
    throw new Error(`Local weather entry not found for ${locationName}`);
  }

  return locData as LocationData;
}

export function getWeatherValue(locData: LocationData, name: string): string {
  return locData.weatherElement.find(el => el.elementName === name)?.time?.[0]?.parameter?.parameterName ?? '';
}
