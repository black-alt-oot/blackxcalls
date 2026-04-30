import { Switch, Route, Router as WouterRouter } from "wouter";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
      <SpeedInsights />
    </WouterRouter>
  );
}

export default App;
