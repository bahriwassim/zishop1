import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import MobileApp from "@/pages/mobile-app";
import HotelDashboard from "@/pages/hotel-dashboard";
import MerchantDashboard from "@/pages/merchant-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import LandingPage from "@/pages/landing-page";
import MerchantLandingPage from "@/pages/merchant-landing";
import ClientLandingPage from "@/pages/client-landing";
import NotFound from "@/pages/not-found";
import Logo from "@/components/Logo";

function Navigation() {
  const [activeTab, setActiveTab] = useState("mobile");

  const tabs = [
    { id: "landing", label: "Accueil", path: "/landing" },
    { id: "merchants", label: "Commerçants", path: "/landing1" },
    { id: "clients", label: "Application", path: "/landing2" },
    { id: "mobile", label: "App Mobile", path: "/" },
    { id: "hotel", label: "Dashboard Hôtel", path: "/hotel" },
    { id: "merchant", label: "Dashboard Commerçant", path: "/merchant" },
    { id: "admin", label: "Admin", path: "/admin" },
  ];

  return (
    <nav className="bg-zishop-blue shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Logo variant="yellow-blue" size="xl" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      window.history.pushState({}, "", tab.path);
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-zishop-blue"
                        : "text-white hover:text-yellow-400 hover:bg-zishop-blue-light"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white">
              {activeTab === "mobile" && "Espace Client Intégré"}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Switch>
        <Route path="/landing" component={LandingPage} />
        <Route path="/landing1" component={MerchantLandingPage} />
        <Route path="/landing2" component={ClientLandingPage} />
        <Route path="/" component={MobileApp} />
        <Route path="/hotel" component={HotelDashboard} />
        <Route path="/merchant" component={MerchantDashboard} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
