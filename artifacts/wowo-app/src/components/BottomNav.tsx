import { Link, useLocation } from "wouter";
import { Home, ListTodo, CalendarDays, CloudSun, PawPrint, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/reminders", icon: ListTodo, label: "提醒" },
  { href: "/calendar", icon: CalendarDays, label: "行事曆" },
  { href: "/", icon: PawPrint, label: "主頁" },
  { href: "/weather", icon: CloudSun, label: "天氣" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          const isHome = href === "/";

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-1.5 transition-all duration-300",
                  isHome
                    ? "rounded-full bg-gradient-to-br from-sky-500/20 via-violet-400/20 to-pink-500/20 shadow-[0_0_24px_rgba(99,102,241,0.18)]"
                    : "rounded-xl",
                  isActive ? "scale-110 ring-2 ring-primary/30" : ""
                )}
              >
                <Icon size={isHome ? 26 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        <Link
          href="/account"
          className={cn(
            "flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors",
            location === "/account" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div
            className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              location === "/account" ? "bg-primary/10 scale-110" : ""
            )}
          >
            <User size={22} strokeWidth={location === "/account" ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-medium">帳號</span>
        </Link>
      </div>
    </nav>
  );
}
