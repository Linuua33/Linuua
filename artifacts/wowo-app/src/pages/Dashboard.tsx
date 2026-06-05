import React, { useEffect, useState } from 'react';
import { PetCharacter } from "@/components/PetCharacter";
import { PetStatus } from "@/components/PetStatus";
import { useDataStore, usePetStore } from "@/store/petStore";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchCwbWeatherData, fetchLocalWeatherData, getWeatherValue } from '@/lib/weather';
import { 
  CloudSun, 
  ListTodo, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Umbrella, 
  Sun 
} from "lucide-react";
import { motion } from "framer-motion";

// 氣象局 API URL
const API_URL = '/api-cwa/api/v1/rest/datastore/F-C0032-001';

export default function Dashboard() {
  const { reminders, toggleReminder } = useDataStore();
  const { addXp, heal } = usePetStore();
  const todayReminders = reminders.slice(0, 3);

  // --- 天氣狀態 ---
  const [weatherInfo, setWeatherInfo] = useState({
    temp: '--',
    location: '讀取中...',
    status: '',
    loading: true
  });

  useEffect(() => {
    // 讀取天氣頁面存下的資料，預設台北市
    const savedCwaName = localStorage.getItem('user-location-cwb') || '臺北市';
    const savedLabel = localStorage.getItem('user-location-label') || '台北市';
    const apiKey = import.meta.env.VITE_CWB_API_KEY;

    async function fetchSyncWeather() {
      if (!apiKey) {
        setWeatherInfo(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        let locData: any;
        try {
          locData = await fetchCwbWeatherData(savedCwaName, apiKey);
        } catch (err) {
          console.warn('Dashboard CWB API 直接存取失敗，改用快取資料', err);
          locData = await fetchLocalWeatherData(savedCwaName);
        }

        const temp = getWeatherValue(locData, 'MinT');
        const status = getWeatherValue(locData, 'Wx');

        setWeatherInfo({
          temp: `${temp || '--'}°`,
          location: savedLabel,
          status: status || '',
          loading: false
        });
      } catch (err) {
        console.error('Dashboard 天氣讀取失敗', err);
        setWeatherInfo(prev => ({ ...prev, loading: false }));
      }
    }

    fetchSyncWeather();
  }, []);

  // 決定天氣圖示
  const getWeatherIcon = () => {
    if (weatherInfo.status.includes('雨')) return <Umbrella className="text-blue-500" size={24} />;
    if (weatherInfo.status.includes('晴')) return <Sun className="text-orange-500" size={24} />;
    return <CloudSun className="text-accent" size={24} />;
  };

  const handleToggle = (id: string, checked: boolean) => {
    toggleReminder(id);
    if (!checked) {
      addXp(15);
      heal(5);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* 頂部 Header 區塊 */}
      <div className="bg-primary/10 rounded-b-[2.5rem] pt-12 pb-8 px-6 shadow-sm border-b border-primary/20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">早安，主人！</h1>
              <p className="text-muted-foreground text-sm">咪咪今天精神很好哦</p>
            </div>

            {/* 右上角動態同步小方框 */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-white/40 flex items-center gap-2">
              {getWeatherIcon()}
              <div>
                <div className="text-sm font-bold leading-none">
                  {weatherInfo.loading ? '--' : weatherInfo.temp}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-0.5 font-bold">
                  <MapPin size={8} /> {weatherInfo.location}
                </div>
              </div>
            </div>
          </div>
          
          <PetCharacter />
        </motion.div>
      </div>

      {/* 下方內容區塊 */}
      <div className="px-5 mt-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PetStatus />
        </motion.div>

        {/* 今日提醒 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <ListTodo size={20} className="text-primary" />
              今日提醒
            </h2>
          </div>
          <div className="space-y-3">
            {todayReminders.map(reminder => (
              <Card key={reminder.id} className="overflow-hidden border-border shadow-sm">
                <div className="flex items-center p-3.5 gap-3">
                  <Checkbox 
                    id={`dash-rem-${reminder.id}`}
                    checked={reminder.checked}
                    onCheckedChange={() => handleToggle(reminder.id, reminder.checked)}
                    className="w-6 h-6 rounded-full border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={`dash-rem-${reminder.id}`}
                      className={`text-base font-bold block truncate transition-all ${reminder.checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                    >
                      {reminder.title}
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold whitespace-nowrap">
                    <Clock size={12} />
                    {reminder.dueTime}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* 近期行程 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <CalendarIcon size={20} className="text-accent" />
              近期行程
            </h2>
          </div>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4 bg-gradient-to-r from-slate-50 to-white">
              <div className="bg-accent/20 rounded-xl p-3 flex flex-col items-center justify-center min-w-[60px]">
                <span className="text-accent font-bold text-sm">10月</span>
                <span className="text-accent font-black text-2xl leading-none mt-1">24</span>
              </div>
              <div>
                <h4 className="font-bold text-foreground">寵物健康檢查</h4>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock size={14} /> 14:00 - 15:30
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}