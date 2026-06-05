import { Progress } from "@/components/ui/progress";
import { Heart, Star } from "lucide-react";
import { usePetStore } from "@/store/petStore";

export function PetStatus() {
  const { name, hp, maxHp, xp, level, maxXp } = usePetStore();
  
  const hpPercentage = (hp / maxHp) * 100;
  const xpPercentage = (xp / maxXp) * 100;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg flex items-center gap-2">
          {name}
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
            Lv.{level}
          </span>
        </h3>
        <span className="text-sm text-muted-foreground font-medium">健康狀態</span>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-destructive font-medium">
              <Heart size={16} fill="currentColor" />
              生命值 (HP)
            </span>
            <span className="font-bold text-destructive">{hp}/{maxHp}</span>
          </div>
          <Progress value={hpPercentage} className="h-2.5 bg-destructive/20" indicatorClassName="bg-destructive" />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-secondary font-medium">
              <Star size={16} fill="currentColor" />
              經驗值 (XP)
            </span>
            <span className="font-bold text-secondary">{xp}/{maxXp}</span>
          </div>
          <Progress value={xpPercentage} className="h-2.5 bg-secondary/20" indicatorClassName="bg-secondary" />
        </div>
      </div>
    </div>
  );
}
