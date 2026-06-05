import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { BottomNav } from "@/components/BottomNav";
import { AuthProvider, useAuth } from "@/context/auth";

// Pages
import Dashboard from "@/pages/Dashboard";
import Reminders from "@/pages/Reminders";
import Calendar from "@/pages/Calendar";
import Weather from "@/pages/Weather";
import Pet from "@/pages/Pet";
import Account from "@/pages/Account";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/reminders" component={Reminders} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/weather" component={Weather} />
      <Route path="/pet" component={Pet} />
      <Route path="/account" component={Account} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Account />;
  }

  return (
    <>
      <Router />
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="font-sans antialiased max-w-md mx-auto bg-background min-h-screen relative shadow-2xl overflow-hidden">
              <AppContent />
            </div>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
