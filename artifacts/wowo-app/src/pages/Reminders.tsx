import { useDataStore, usePetStore } from "@/store/petStore";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Camera, Clock, Sparkles, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Reminders() {
  const { reminders, toggleReminder, addReminder } = useDataStore();
  const { addXp, heal, takeDamage } = usePetStore();
  const { toast } = useToast();
  const [photoOpen, setPhotoOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderCategory, setNewReminderCategory] = useState("日常");
  const [newReminderDueTime, setNewReminderDueTime] = useState("09:00");

  const todoCount = reminders.filter((reminder) => !reminder.checked).length;

  const handleToggle = (id: string, checked: boolean) => {
    toggleReminder(id);
    if (!checked) {
      addXp(20);
      heal(10);
      toast({
        title: "太棒了！",
        description: "任務完成後，咪咪獲得 XP 和 HP。",
      });
    } else {
      takeDamage(5);
    }
  };

  const handleAddReminder = () => {
    if (!newReminderTitle.trim()) {
      toast({
        title: "請輸入提醒內容",
        description: "提醒事項標題不可為空。",
      });
      return;
    }

    addReminder({
      title: newReminderTitle.trim(),
      checked: false,
      category: newReminderCategory,
      dueTime: newReminderDueTime,
    });

    setDialogOpen(false);
    setNewReminderTitle("");
    setNewReminderCategory("日常");
    setNewReminderDueTime("09:00");

    toast({
      title: "新增成功",
      description: "新的提醒事項已保存。",
    });
  };

  const handleCamera = () => {
    setPhotoOpen(true);
    setTimeout(() => {
      setPhotoOpen(false);
      toast({
        title: "照片已確認",
        description: "攜帶物品確認完成，咪咪很開心！",
      });
      addXp(30);
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* 頂部 Header: 調整為 pt-18，優化留白過多的問題 */}
      <div className="bg-gradient-to-r from-sky-500/15 via-primary/10 to-violet-500/15 pt-18 pb-8 px-6 rounded-b-[3rem] shadow-sm border-b border-white/10">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            <Sparkles size={18} /> 今日提醒
          </div>
          <h1 className="text-3xl font-black text-foreground">溫柔提醒你的日常。</h1>
          <p className="text-sm text-muted-foreground">快速檢視當前待完成任務，讓咪咪每天都健康又開心。</p>
          <div className="mt-4 flex justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary/90">
                  <Plus size={16} /> 新增提醒
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增提醒事項</DialogTitle>
                  <DialogDescription>為當天設定新的提醒事項，會自動保存於本機。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 pt-4">
                  <label className="grid gap-2 text-sm">
                    標題
                    <input
                      value={newReminderTitle}
                      onChange={(e) => setNewReminderTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      placeholder="例如：買早餐、記得運動"
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    分類
                    <select
                      value={newReminderCategory}
                      onChange={(e) => setNewReminderCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      <option>日常</option>
                      <option>工作</option>
                      <option>健康</option>
                      <option>飲食</option>
                      <option>其他</option>
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm">
                    到期時間
                    <input
                      type="time"
                      value={newReminderDueTime}
                      onChange={(e) => setNewReminderDueTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </label>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                    取消
                  </Button>
                  <Button type="button" onClick={handleAddReminder}>
                    儲存提醒
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* 內容區塊: 使用 mt-[-1.5rem] 讓卡片適度上浮，減少與標題間的距離 */}
      <div className="px-5 mt-[-1.5rem] space-y-5 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">待完成</p>
            <p className="mt-3 text-3xl font-bold text-foreground">{todoCount}</p>
            <p className="mt-2 text-sm text-muted-foreground">剩餘提醒事項</p>
          </div>
          <div className="rounded-3xl bg-slate-950 text-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300/80">咪咪狀態</p>
            <p className="mt-3 text-3xl font-bold">活力滿滿</p>
            <p className="mt-2 text-sm text-slate-300">完成提醒即可提升寵物狀態。</p>
          </div>
        </div>

        <AnimatePresence>
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden border-transparent shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-white via-slate-50 to-slate-100">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id={`rem-${reminder.id}`}
                      checked={reminder.checked}
                      onCheckedChange={() => handleToggle(reminder.id, reminder.checked)}
                      className="w-8 h-8 rounded-full border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <div>
                      <label
                        htmlFor={`rem-${reminder.id}`}
                        className={`text-base font-semibold transition-all ${reminder.checked ? "text-muted-foreground line-through" : "text-foreground"}`}
                      >
                        {reminder.title}
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-slate-100 px-2 py-1">{reminder.category}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {reminder.dueTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {reminder.photoRequired && (
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-full w-11 h-11 ${reminder.checked ? "border-primary text-primary" : "border-slate-300 text-slate-500"}`}
                      onClick={handleCamera}
                      disabled={reminder.checked || photoOpen}
                    >
                      <Camera size={18} />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {photoOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm aspect-[3/4] bg-slate-900 rounded-[2rem] border-4 border-slate-700 flex items-center justify-center overflow-hidden relative">
            <div className="text-slate-400 flex flex-col items-center gap-4">
              <Camera size={48} />
              <p className="font-medium text-lg">模擬相機畫面</p>
            </div>
            <div className="absolute inset-0 border-2 border-primary/50 m-8 rounded-xl" />
          </div>
          <p className="text-white mt-8 text-center text-lg font-bold">請拍攝物品以完成任務</p>
        </div>
      )}
    </div>
  );
}