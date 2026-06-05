import React, { useEffect, useState, useCallback } from 'react';
import { CloudSun, Droplets, Umbrella, Sun, Thermometer, MapPin, MapPinOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWeatherData, getWeatherValue } from '@/lib/weather';

const LOCATIONS = [
  { id: 'taipei', label: '台北市', cwbName: '臺北市', lat: 25.0330, lon: 121.5654 },
  { id: 'new-taipei', label: '新北市', cwbName: '新北市', lat: 25.0123, lon: 121.4657 },
  { id: 'taoyuan', label: '桃園市', cwbName: '桃園市', lat: 24.9936, lon: 121.3010 },
  { id: 'hsinchu-city', label: '新竹市', cwbName: '新竹市', lat: 24.8138, lon: 120.9675 },
  { id: 'hsinchu-county', label: '新竹縣', cwbName: '新竹縣', lat: 24.8387, lon: 121.0177 },
  { id: 'miaoli', label: '苗栗縣', cwbName: '苗栗縣', lat: 24.5602, lon: 120.8214 },
  { id: 'taichung', label: '台中市', cwbName: '臺中市', lat: 24.1477, lon: 120.6736 },
  { id: 'changhua', label: '彰化縣', cwbName: '彰化縣', lat: 24.0519, lon: 120.5161 },
  { id: 'nantou', label: '南投縣', cwbName: '南投縣', lat: 23.9151, lon: 120.6859 },
  { id: 'yunlin', label: '雲林縣', cwbName: '雲林縣', lat: 23.7092, lon: 120.4313 },
  { id: 'chiayi-city', label: '嘉義市', cwbName: '嘉義市', lat: 23.4815, lon: 120.4533 },
  { id: 'chiayi-county', label: '嘉義縣', cwbName: '嘉義縣', lat: 23.4519, lon: 120.2555 },
  { id: 'tainan', label: '台南市', cwbName: '臺南市', lat: 22.9997, lon: 120.2270 },
  { id: 'kaohsiung', label: '高雄市', cwbName: '高雄市', lat: 22.6273, lon: 120.3014 },
  { id: 'pingtung', label: '屏東縣', cwbName: '屏東縣', lat: 22.6660, lon: 120.4860 },
  { id: 'taitung', label: '台東縣', cwbName: '臺東縣', lat: 22.7554, lon: 121.1505 },
  { id: 'hualien', label: '花蓮縣', cwbName: '花蓮縣', lat: 23.9772, lon: 121.6044 },
  { id: 'yilan', label: '宜蘭縣', cwbName: '宜蘭縣', lat: 24.7021, lon: 121.7377 },
  { id: 'penghu', label: '澎湖縣', cwbName: '澎湖縣', lat: 23.5712, lon: 119.5793 },
  { id: 'kinmen', label: '金門縣', cwbName: '金門縣', lat: 24.4354, lon: 118.3550 },
  { id: 'lienchiang', label: '連江縣', cwbName: '連江縣', lat: 26.1517, lon: 119.9298 },
];

export default function Weather() {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const savedId = localStorage.getItem('user-location-id');
    return LOCATIONS.find(l => l.id === savedId) || LOCATIONS[0];
  });
  
  const [weather, setWeather] = useState({ temp: '--', condition: '讀取中...', feels: '--', rain: '--' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isAutoLocating, setIsAutoLocating] = useState(false);

  const syncLocationToStorage = (loc: typeof LOCATIONS[0]) => {
    localStorage.setItem('user-location-id', loc.id);
    localStorage.setItem('user-location-cwb', loc.cwbName);
    localStorage.setItem('user-location-label', loc.label);
  };

  const findNearestLocation = (lat: number, lon: number) => {
    return LOCATIONS.reduce((prev, curr) => {
      const prevDist = Math.sqrt(Math.pow(prev.lat - lat, 2) + Math.pow(prev.lon - lon, 2));
      const currDist = Math.sqrt(Math.pow(curr.lat - lat, 2) + Math.pow(curr.lon - lon, 2));
      return currDist < prevDist ? curr : prev;
    });
  };

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("您的瀏覽器不支援定位功能");
      return;
    }

    setIsAutoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = findNearestLocation(position.coords.latitude, position.coords.longitude);
        setSelectedLocation(nearest);
        syncLocationToStorage(nearest);
        setGpsStatus('granted');
        setIsAutoLocating(false);
      },
      (err) => {
        setGpsStatus('denied');
        setIsAutoLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        setGpsStatus(result.state as any);
        if (result.state === 'granted') {
          handleGetLocation();
        }
        result.onchange = () => setGpsStatus(result.state as any);
      });
    }
  }, [handleGetLocation]);

  // 🔥 核心修正：直接向氣象署 API 連線。如果打包時有灌入金鑰就用金鑰，沒有的話嘗試讀取環境變數。
  useEffect(() => {
    // 同時相容兩種變數名稱，確保一定拿得到鑰匙
    const apiKey = import.meta.env.VITE_CWB_API_KEY || import.meta.env.VITE_CWA_API_KEY;
    
    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        // 直接現場跟氣象署連線抓即時資料
        const locData = await getWeatherData(selectedLocation.cwbName, apiKey);
        const getVal = (name: string) => getWeatherValue(locData, name);

        setWeather({
          condition: getVal('Wx') ?? '未知',
          rain: getVal('PoP') ? `${getVal('PoP')}%` : '--%',
          temp: getVal('MinT') ? `${getVal('MinT')}°` : '--',
          feels: getVal('CI') ?? '--',
        });
      } catch (err) {
        console.error('現場取得天氣失敗，嘗試讀取備用本地檔案', err);
        // 如果現場抓失敗（例如沒金鑰），才降級去讀本地 JSON 當備案
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}weather-data.json`);
          const allWeatherData = await response.json();
          const locData = allWeatherData[selectedLocation.cwbName] || allWeatherData[selectedLocation.label];
          if (locData) {
            setWeather({
              condition: locData.Wx || locData.condition || '未知',
              rain: locData.PoP !== undefined ? `${locData.PoP}%` : '--%',
              temp: locData.MinT ? `${locData.MinT}°` : (locData.temp ? `${locData.temp}°` : '--'),
              feels: locData.CI || locData.feels || '--',
            });
          }
        } catch (jsonErr) {
          setError('取得失敗');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [selectedLocation]);

  const getSuggestion = () => {
    if (loading) return { title: "分析中...", desc: "正在計算建議...", icon: <CloudSun />, color: "bg-gray-100" };
    const isRaining = weather.condition.includes('雨') || parseInt(weather.rain) >= 30;
    if (isRaining) return { title: "記得帶雨傘！", desc: `目前降雨機率 ${weather.rain}，出門記得帶傘喔。`, icon: <Umbrella className="text-blue-600 w-7 h-7" />, color: "bg-blue-50" };
    const isSunny = weather.condition.includes('晴');
    const isHot = weather.feels.includes('熱');
    if (isSunny || isHot) return { title: "要注意防曬！", desc: "陽光強烈且體感悶熱，建議穿著防曬衣物並補充水分。", icon: <Sun className="text-orange-600 w-7 h-7" />, color: "bg-orange-50" };
    return { title: "天氣還不錯！", desc: "目前氣溫舒適，是個適合出門的好日子。", icon: <Thermometer className="text-green-600 w-7 h-7" />, color: "bg-green-50" };
  };

  const suggestion = getSuggestion();

  return (
    <div className="flex flex-col min-h-screen p-6 gap-6 bg-slate-50 relative">
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={handleGetLocation}
          disabled={isAutoLocating}
          className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-all ${
            isAutoLocating ? 'animate-pulse bg-blue-100' :
            gpsStatus === 'granted' ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400'
          }`}
        >
          {gpsStatus === 'granted' ? <MapPin size={20} /> : <MapPinOff size={20} />}
        </button>
      </div>

      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-black text-slate-800">Weather</h1>
        <div className="relative">
          <select
            value={selectedLocation.id}
            onChange={(e) => {
              const loc = LOCATIONS.find(l => l.id === e.target.value);
              if (loc) {
                setSelectedLocation(loc);
                syncLocationToStorage(loc);
              }
            }}
            className="w-full p-4 bg-white shadow-sm rounded-2xl text-lg font-medium outline-none appearance-none cursor-pointer"
          >
            {LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.label}</option>)}
          </select>
          {gpsStatus === 'granted' && (
            <p className="mt-2 text-[11px] text-green-600 font-bold flex items-center gap-1 px-2">
              <MapPin size={12} /> 已根據您的位置自動定位
            </p>
          )}
        </div>
      </header>

      <section className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
            <CloudSun className="w-24 h-24 mb-4" />
          </motion.div>
          <div className="text-7xl font-bold">{loading ? '...' : weather.temp}</div>
          <h2 className="text-2xl font-medium mt-2">{weather.condition}</h2>
          
          <div className="flex gap-12 mt-10 w-full justify-center border-t border-white/20 pt-8">
            <div className="text-center">
              <p className="text-white/60 text-[10px] uppercase font-bold mb-1">降雨機率</p>
              <p className="text-xl font-bold">{weather.rain}</p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-[10px] uppercase font-bold mb-1">體感描述</p>
              <p className="text-xl font-bold">{weather.feels}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${suggestion.color} p-8 rounded-[2.5rem] border border-transparent transition-colors duration-500`}>
        <div className="flex gap-5 items-start">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            {suggestion.icon}
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-800">{suggestion.title}</h3>
            <p className="text-slate-500 mt-1 leading-relaxed">{suggestion.desc}</p>
          </div>
        </div>
      </section>

      <footer className="mt-auto text-center py-4 text-slate-300 text-[10px] tracking-widest uppercase">
        Central Weather Administration
      </footer>
    </div>
  );
}
