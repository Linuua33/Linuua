import fs from 'fs/promises';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const publicDir = path.resolve(process.cwd(), 'public');
const outputPath = path.join(publicDir, 'weather-data.json');

const LOCATION_NAMES = [
  '臺北市',
  '新北市',
  '桃園市',
  '新竹市',
  '新竹縣',
  '苗栗縣',
  '臺中市',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義市',
  '嘉義縣',
  '臺南市',
  '高雄市',
  '屏東縣',
  '臺東縣',
  '花蓮縣',
  '宜蘭縣',
  '澎湖縣',
  '金門縣',
  '連江縣'
];

const DEFAULT_WEATHER = {
  Wx: '晴時多雲',
  PoP: '10',
  MinT: '26',
  CI: '舒適'
};

function parseEnv(content) {
  const result = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    result[key] = rest.join('=');
  }
  return result;
}

function makeLocationData(locationName) {
  return {
    locationName,
    weatherElement: [
      { elementName: 'Wx', time: [{ parameter: { parameterName: DEFAULT_WEATHER.Wx } }] },
      { elementName: 'PoP', time: [{ parameter: { parameterName: DEFAULT_WEATHER.PoP } }] },
      { elementName: 'MinT', time: [{ parameter: { parameterName: DEFAULT_WEATHER.MinT } }] },
      { elementName: 'CI', time: [{ parameter: { parameterName: DEFAULT_WEATHER.CI } }] }
    ]
  };
}

async function fetchCwbData(apiKey) {
  const url = new URL('https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001');
  url.searchParams.set('Authorization', apiKey);
  url.searchParams.set('elementName', 'Wx,PoP,MinT,CI');
  url.searchParams.set('format', 'JSON');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`CWB fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function buildWeatherData() {
  const env = {};
  try {
    const envRaw = await fs.readFile(envPath, 'utf8');
    Object.assign(env, parseEnv(envRaw));
  } catch {
    console.warn('No .env file found, using fallback weather data only.');
  }

  const weatherData = {
    updated: new Date().toISOString(),
    locations: {}
  };

  const apiKey = process.env.CWB_API_KEY ?? env.VITE_CWB_API_KEY;
  if (apiKey) {
    try {
      const cwbData = await fetchCwbData(apiKey);
      for (const record of cwbData.records?.location || []) {
        weatherData.locations[record.locationName] = {
          locationName: record.locationName,
          weatherElement: record.weatherElement
        };
      }
      if (Object.keys(weatherData.locations).length > 0) {
        weatherData.updated = cwbData.records?.datasetInfo?.update || weatherData.updated;
        console.log('Fetched current CWB weather data successfully.');
      }
    } catch (error) {
      console.warn('Unable to fetch CWB data, falling back to default offline weather data.', error);
    }
  } else {
    console.warn('CWB_API_KEY is not set, generating fallback weather data only.');
  }

  for (const locationName of LOCATION_NAMES) {
    if (!weatherData.locations[locationName]) {
      weatherData.locations[locationName] = makeLocationData(locationName);
    }
  }

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(weatherData, null, 2) + '\n', 'utf8');
  console.log(`Wrote fallback weather data to ${outputPath}`);
}

buildWeatherData().catch((err) => {
  console.error(err);
  process.exit(1);
});
