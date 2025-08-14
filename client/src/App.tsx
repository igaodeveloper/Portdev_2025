import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Components
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CosmicBackground } from "./components/CosmicBackground";
import { WhatsAppButton } from "./components/WhatsAppButton";

// Pages
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Projects } from "./pages/Projects";
import { Videos } from "./pages/Videos";
import { IDEPage } from "./pages/IDEPage";
import { Contact } from "./pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/projects" component={Projects} />
      <Route path="/videos" component={Videos} />
      <Route path="/ide" component={IDEPage} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen cosmic-bg relative">
          <CosmicBackground />
          
          <div className="relative z-10">
            <Header />
            
            <main>
              <Router />
            </main>
            
            <Footer />
          </div>
          
          <WhatsAppButton />
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
