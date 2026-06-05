import { PetCharacter } from "@/components/PetCharacter";
import { PetStatus } from "@/components/PetStatus";
import { usePetStore } from "@/store/petStore";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Pet() {
  const { name, level, addXp } = usePetStore();
  const [mood, setMood] = useState<"idle" | "happy" | "sad">("idle");
  const [interactions, setInteractions] = useState([
    { id: 1, text: "餵食健康零食", checked: false, xp: 15 },
    { id: 2, text: "摸摸頭", checked: false, xp: 10 },
    { id: 3, text: "陪玩逗貓棒", checked: false, xp: 25 },
  ]);

  const handleInteract = (id: number, xp: number) => {
    setInteractions(interactions.map(i => {
      if (i.id === id && !i.checked) {
        addXp(xp);
        setMood("happy");
        setTimeout(() => setMood("idle"), 2000);
        return { ...i, checked: true };
      }
      return i;
    }));
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="bg-[url('https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
        <div className="bg-background/80 backdrop-blur-xl pt-14 pb-8 px-6 rounded-b-[3rem] shadow-sm border-b border-border">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">寵物互動</h1>
            <div className="bg-primary/20 text-primary px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Trophy size={16} />
              親密度 Lv.{level}
            </div>
          </div>
          
          <div className="py-8 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <PetCharacter mood={mood} className="w-64 h-64 mx-auto" />
            </motion.div>
            
            {mood === "happy" && (
              <motion.div 
                className="absolute top-1/4 right-1/4 text-primary"
                initial={{ y: 20, opacity: 0, scale: 0.5 }}
                animate={{ y: -20, opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0 }}
              >
                <Sparkles size={32} />
              </motion.div>
            )}
          </div>
          
          <PetStatus />
        </div>
      </div>

      <div className="px-5 mt-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Gift size={20} className="text-primary" />
            互動清單
          </h2>
          <div className="space-y-3">
            {interactions.map((item) => (
              <Card key={item.id} className="border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={`interact-${item.id}`}
                      checked={item.checked}
                      disabled={item.checked}
                      onCheckedChange={() => handleInteract(item.id, item.xp)}
                      className="w-6 h-6 rounded-full border-2 border-primary data-[state=checked]:bg-primary"
                    />
                    <label 
                      htmlFor={`interact-${item.id}`}
                      className={`text-base font-medium ${item.checked ? 'text-muted-foreground' : 'text-foreground'}`}
                    >
                      {item.text}
                    </label>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-secondary">
                    <Sparkles size={14} />
                    +{item.xp} XP
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">今日成就紀錄</h2>
          <Card className="border-border bg-card/50">
            <CardContent className="p-4">
              <ul className="space-y-3 relative before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-border">
                <li className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">完成「帶便當」</p>
                    <p className="text-xs text-muted-foreground mt-0.5">獲得 15 XP</p>
                  </div>
                </li>
                <li className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">準備簡報檔案</p>
                    <p className="text-xs text-muted-foreground mt-0.5">獲得 10 XP</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
