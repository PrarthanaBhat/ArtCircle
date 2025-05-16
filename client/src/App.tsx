import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Gallery from "@/pages/Gallery";
import Categories from "@/pages/Categories";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PhotoDetail from "@/pages/PhotoDetail";
import Dashboard from "@/pages/Dashboard";
import { ThemeProvider } from "@/lib/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/gallery" component={Gallery}/>
      <Route path="/categories" component={Categories}/>
      <Route path="/about" component={About}/>
      <Route path="/contact" component={Contact}/>
      <Route path="/photo/:id" component={PhotoDetail}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
