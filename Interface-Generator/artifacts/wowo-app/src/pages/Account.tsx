import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut, Settings, Bell, CircleHelp, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

export default function Account() {
  const { isAuthenticated, userEmail, login, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      toast({
        title: "登入成功",
        description: "歡迎回到窩窩！",
      });
      setLocation("/");
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "已登出",
      description: "下次再見，主人！",
    });
    setLocation("/account");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pb-24 bg-background flex flex-col">
        <div className="bg-primary pt-14 pb-12 px-6 rounded-b-[3rem] shadow-sm text-center">
          <h1 className="text-2xl font-bold text-primary-foreground">帳號登入</h1>
          <p className="text-primary-foreground/80 mt-2 text-sm">請先登入以繼續使用窩窩</p>
        </div>

        <div className="px-6 flex-1 flex flex-col justify-center -mt-8 relative z-10">
          <Card className="border-border shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">歡迎回來</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">登入後即可使用所有功能</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">電子郵件</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-muted/50 border-transparent focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密碼</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="bg-muted/50 border-transparent focus-visible:ring-primary"
                  />
                </div>
                <Button type="submit" className="w-full font-bold text-md h-12 rounded-xl mt-2">
                  登入
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                還沒有帳號？ <span className="text-primary font-bold">立即註冊</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="bg-primary/10 pt-14 pb-8 px-6 rounded-b-[3rem] shadow-sm border-b border-primary/20">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 border-4 border-background shadow-md">
            <AvatarImage src=" " />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">L</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-foreground mt-4">Lin</h1>
          <p className="text-muted-foreground text-sm mt-1">{userEmail}</p>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-6">
        <Card className="border-border overflow-hidden shadow-xl">
          <div className="p-1">
            <button className="w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left hover:bg-muted/50">
              <div className="flex items-center gap-3 text-foreground font-medium">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Settings size={20} />
                </div>
                設定個人資料
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
            <Separator className="mx-4 my-1 w-auto" />
            <button className="w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left hover:bg-muted/50">
              <div className="flex items-center gap-3 text-foreground font-medium">
                <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                  <Bell size={20} />
                </div>
                開啟通知
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
            <Separator className="mx-4 my-1 w-auto" />
            <button className="w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left hover:bg-muted/50">
              <div className="flex items-center gap-3 text-foreground font-medium">
                <div className="p-2 bg-accent/20 text-accent-foreground rounded-lg">
                  <CircleHelp size={20} />
                </div>
                常見問題與支援
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
          </div>
        </Card>

        <Button
          variant="outline"
          className="w-full h-14 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 font-bold text-base"
          onClick={handleLogout}
        >
          <LogOut className="mr-2" size={20} />
          登出
        </Button>
      </div>
    </div>
  );
}
