import { useEffect, useState } from "react";
import { CloudSun, Umbrella, Sun, Thermometer } from "lucide-react";

const LOCATION = { label: "台北市", cwbName: "臺北市" };
const API_URL = "/api-cwa/api/v1/rest/datastore/F-C0032-001";

export default function WeatherSummary() {
  const [weather, setWeather] = useState({ temp: "--", condition: "讀取中...", feels: "--", rain: "--" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_CWB_API_KEY;
    if (!apiKey) {
      setError("尚未設定 API 金鑰");
      return;
    }

    let cancelled = false;
    async function fetchWeather() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          Authorization: apiKey,
          locationName: LOCATION.cwbName,
          elementName: "Wx,PoP,MinT,CI",
          format: "JSON",
        });
        const res = await fetch(`${API_URL}?${params.toString()}`);
        const data = await res.json();
        const locData = data.records.location[0];
        const getVal = (name: string) => locData.weatherElement.find((el: any) => el.elementName === name)?.time[0].parameter.parameterName;

        if (!cancelled) {
          setWeather({
            condition: getVal("Wx") ?? "未知",
            rain: getVal("PoP") ? `${getVal("PoP")} %` : "--",
            temp: getVal("MinT") ? `${getVal("MinT")}°` : "--",
            feels: getVal("CI") ?? "--",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError("取得天氣失敗");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, []);

  const suggestion = () => {
    if (loading) return { title: "讀取中...", desc: "正在取得最新天氣資訊。", icon: <CloudSun className="w-6 h-6 text-white" />, color: "bg-sky-500/20" };
    const isRaining = weather.condition.includes("雨") || Number(weather.rain.replace("%", "")) >= 30;
    if (isRaining) return { title: "可能會下雨", desc: `降雨機率 ${weather.rain}，出門記得帶雨具。`, icon: <Umbrella className="w-6 h-6 text-white" />, color: "bg-cyan-500/20" };
    if (weather.condition.includes("晴")) return { title: "好天氣", desc: "晴朗舒適，適合帶咪咪出門散步。", icon: <Sun className="w-6 h-6 text-white" />, color: "bg-amber-500/20" };
    return { title: "舒適的一天", desc: "目前氣溫穩定，注意補充水分即可。", icon: <Thermometer className="w-6 h-6 text-white" />, color: "bg-emerald-500/20" };
  };

  const current = suggestion();

  return (
    <section className="rounded-[2.5rem] overflow-hidden bg-slate-950 text-white shadow-2xl">
      <div className="px-6 pb-6 pt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-indigo-500/10 opacity-90" />
        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-200/80">目前天氣</p>
              <h2 className="text-2xl font-bold">{LOCATION.label}</h2>
            </div>
            <div className="rounded-3xl bg-white/10 px-4 py-2 text-sm text-white/90">即時更新</div>
          </div>

          <div className="flex items-center gap-6">
            <div className="p-4 rounded-3xl bg-white/10">
              <CloudSun size={48} />
            </div>
            <div>
              <p className="text-5xl font-bold tracking-tight">{loading ? "..." : weather.temp}</p>
              <p className="text-sm text-slate-200/90 mt-1">{weather.condition}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-slate-300 text-[11px] uppercase tracking-[0.2em] mb-2">雨量機率</p>
              <p className="text-lg font-semibold">{weather.rain}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-slate-300 text-[11px] uppercase tracking-[0.2em] mb-2">體感</p>
              <p className="text-lg font-semibold">{weather.feels}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-slate-900/80 px-6 py-4">
        <div className={`rounded-3xl px-4 py-4 ${current.color}`}>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">{current.icon}</div>
            <div>
              <p className="font-semibold text-white">{current.title}</p>
              <p className="text-sm text-slate-200/80 mt-1">{current.desc}</p>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="px-6 pb-6 text-sm text-rose-300">{error}</p>}
    </section>
  );
}
