import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Volume2, MapPin, Clock, Plus } from "lucide-react";
import { useDataStore, usePetStore } from "@/store/petStore";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("12:00");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventTask, setNewEventTask] = useState("");

  const { addXp, heal } = usePetStore();
  const { toast } = useToast();
  const { calendarEvents, toggleCalendarTask, addCalendarEvent } = useDataStore();

  const selectedDate = date?.toISOString().slice(0, 10) ?? new Date().toISOString().slice(0, 10);
  const events = calendarEvents.filter((event) => event.date === selectedDate);

  const handleTaskToggle = (eventId: number, taskId: string) => {
    toggleCalendarTask(eventId, taskId);
    const event = calendarEvents.find((event) => event.id === eventId);
    const task = event?.tasks.find((task) => task.id === taskId);
    if (task && !task.checked) {
      addXp(10);
      heal(2);
    }
  };

  const handleAnnounce = (title: string) => {
    toast({
      title: "語音播報中...",
      description: `下一個行程：${title}`,
      duration: 3000,
    });
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) {
      toast({
        title: "無法新增事件",
        description: "請輸入活動標題。",
      });
      return;
    }

    addCalendarEvent({
      title: newEventTitle.trim(),
      time: newEventTime,
      location: newEventLocation.trim() || "待定地點",
      date: selectedDate,
      tasks: [
        {
          id: `task-${Date.now()}`,
          text: newEventTask.trim() || "請補上準備事項",
          checked: false,
        },
      ],
    });

    setDialogOpen(false);
    setNewEventTitle("");
    setNewEventLocation("");
    setNewEventTask("");
    setNewEventTime("12:00");

    toast({
      title: "新增成功",
      description: "已將新行程儲存到您的行事曆。",
    });
  };

  const monthLabel = date?.toLocaleDateString("zh-TW", { month: "long" });
  const dayLabel = date?.toLocaleDateString("zh-TW", { weekday: "short", day: "numeric" });

  return (
    <div className="min-h-screen pb-24 bg-background">
<div className="bg-slate-50 pt-14 pb-8 px-6 rounded-b-[2.5rem] shadow-sm border-b border-border">
  <h1 className="text-2xl font-bold text-black text-center">
    行事曆
  </h1>
</div>
      <div className="px-5 mt-[-2rem] relative z-10 space-y-6">
        <Card className="overflow-hidden rounded-[2rem] border-border shadow-xl">
          <div className="bg-gradient-to-r from-secondary/20 to-accent/15 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">目前月份</p>
                <h2 className="text-2xl font-bold text-foreground mt-1">{monthLabel}</h2>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{dayLabel}</p>
                <p className="mt-1">{date?.toLocaleDateString("zh-TW")}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-background">
<CalendarComponent
  mode="single"
  selected={date}
  onSelect={setDate}
  className="w-full"
  classNames={{
    months: "w-full flex flex-col space-y-4",
    month: "w-full space-y-6", // 增加一點上下間距
    caption: "flex justify-center pt-1 relative items-center px-8 mb-4",
    caption_label: "text-base font-black text-slate-800",
    nav: "space-x-1 flex items-center",
    nav_button: "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 transition-all",
    table: "w-full border-collapse", 
    head_row: "flex w-full",
    head_cell: "text-slate-400 flex-1 font-bold text-[12px] uppercase text-center pb-4", // ⭐ 使用 flex-1 代替固定百分比
    row: "flex w-full mt-2",
    cell: "relative p-0 text-center text-sm flex-1 focus-within:relative focus-within:z-20", // ⭐ 使用 flex-1 讓每一格自動撐滿
    day: "h-12 w-12 p-0 mx-auto font-bold rounded-2xl transition-all hover:bg-slate-100 flex items-center justify-center text-center", // ⭐ 加大按鈕尺寸 (h-12 w-12) 並完全置中
    day_selected: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg scale-110", // 選中時稍微放大
    day_today: "bg-indigo-50 text-indigo-600 ring-2 ring-inset ring-indigo-200",
    day_outside: "text-slate-300 opacity-50",
    day_disabled: "text-slate-300 opacity-50",
  }}
/>          </div>
        </Card>

        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">今日行程</h2>
            <p className="text-sm text-muted-foreground">點按任務即可更新狀態</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full bg-primary text-white shadow-lg hover:bg-primary/90">
                <Plus size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增行程</DialogTitle>
                <DialogDescription>新增當天行程與準備事項，會自動儲存至本機。</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 pt-4">
                <label className="grid gap-2 text-sm">
                  活動標題
                  <input
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="例如：下午運動"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  時間
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  地點
                  <input
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="例如：公園、會議室"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  準備事項
                  <input
                    value={newEventTask}
                    onChange={(e) => setNewEventTask(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="例如：帶筆記本"
                  />
                </label>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                  取消
                </Button>
                <Button type="button" onClick={handleAddEvent}>
                  儲存行程
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-5">
          {events.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-muted-foreground">
              尚無選擇日期的行程，點選右上角 + 新增一個項目。
            </div>
          ) : events.map((event) => (
              <Card key={event.id} className="border-border overflow-hidden shadow-sm">
                <div className="bg-slate-100 p-4 border-b border-border">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{event.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={14} /> {event.time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} /> {event.location}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-background border-border text-primary hover:bg-primary/10"
                      onClick={() => handleAnnounce(event.title)}
                    >
                      <Volume2 size={18} />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4 bg-white">
                  <h4 className="text-sm font-bold text-muted-foreground mb-3">準備事項</h4>
                  <div className="space-y-3">
                    {event.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.checked}
                          onCheckedChange={() => handleTaskToggle(event.id, task.id)}
                          className="w-5 h-5 rounded-md border-2 border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"
                        />
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`text-sm font-medium transition-all ${task.checked ? "text-muted-foreground line-through" : "text-foreground"}`}
                        >
                          {task.text}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
