import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import MobileApp from "@/pages/mobile-app";
import HotelDashboard from "@/pages/hotel-dashboard";
import MerchantDashboard from "@/pages/merchant-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLogin from "@/pages/admin-login";
import HotelLogin from "@/pages/hotel-login";
import MerchantLogin from "@/pages/merchant-login";
import LandingPage from "@/pages/landing-page";
import MerchantLandingPage from "@/pages/merchant-landing";
import ClientLandingPage from "@/pages/client-landing";
import NotFound from "@/pages/not-found";
import Logo from "@/components/Logo";
import ClientRegister from "@/pages/client-register";
import TestApi from "@/pages/test-api";

function ProtectedRoute({ component: Component, allowedRoles }: { component: React.ComponentType; allowedRoles: string[] }) {
  const [location, setLocation] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      // Redirect to appropriate login page based on route
      if (location.includes("/admin")) {
        setLocation("/admin/login");
      } else if (location.includes("/hotel")) {
        setLocation("/hotel/login");
      } else if (location.includes("/merchant")) {
        setLocation("/merchant/login");
      }
      return;
    }

    const user = JSON.parse(userStr);
    if (!allowedRoles.includes(user.role)) {
      setLocation("/");
      return;
    }

    setIsAuthorized(true);
  }, [location, allowedRoles, setLocation]);

  if (isAuthorized === null) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return isAuthorized ? <Component /> : null;
}

function Navigation() {
  const [activeTab, setActiveTab] = useState("mobile");
  const [user, setUser] = useState<any>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("hotel");
    localStorage.removeItem("merchant");
    window.location.href = "/";
  };

  const tabs = [
    { id: "landing", label: "Accueil", path: "/landing" },
    { id: "merchants", label: "Commerçants", path: "/landing1" },
    { id: "clients", label: "Application", path: "/landing2" },
    { id: "mobile", label: "App Mobile", path: "/" },
    { id: "hotel", label: "Dashboard Hôtel", path: "/hotel" },
    { id: "merchant", label: "Dashboard Commerçant", path: "/merchant" },
    { id: "admin", label: "Admin", path: "/admin" },
    { id: "test", label: "Test Auth", path: "/test" },
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
                      setLocation(tab.path);
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
            {user && (
              <>
                <span className="text-sm text-white">
                  {user.username} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-white hover:text-yellow-400"
                >
                  Déconnexion
                </button>
              </>
            )}
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
        
        {/* Test route */}
        <Route path="/test" component={TestAuth} />
        
        {/* Login routes */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/hotel/login" component={HotelLogin} />
        <Route path="/merchant/login" component={MerchantLogin} />
        
        {/* Protected routes */}
        <Route path="/hotel">
          {() => <ProtectedRoute component={HotelDashboard} allowedRoles={["hotel"]} />}
        </Route>
        <Route path="/merchant">
          {() => <ProtectedRoute component={MerchantDashboard} allowedRoles={["merchant"]} />}
        </Route>
        <Route path="/admin">
          {() => <ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />}
        </Route>
        
        <Route path="/test-api" component={TestApi} />
        
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

// Test component for debugging auth
function TestAuth() {
  const [userData, setUserData] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string>("");
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    const hotel = localStorage.getItem("hotel");
    const merchant = localStorage.getItem("merchant");
    
    setUserData({
      user: user ? JSON.parse(user) : null,
      hotel: hotel ? JSON.parse(hotel) : null,
      merchant: merchant ? JSON.parse(merchant) : null,
    });
  }, []);
  
  const testApiLogin = async (username: string, password: string) => {
    setError("");
    setApiResponse(null);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      setApiResponse({
        status: response.status,
        ok: response.ok,
        data: data
      });
      
      if (response.ok && data.user) {
        // Try to store in localStorage manually
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.entity) {
          if (data.user.role === "hotel") {
            localStorage.setItem("hotel", JSON.stringify(data.entity));
          } else if (data.user.role === "merchant") {
            localStorage.setItem("merchant", JSON.stringify(data.entity));
          }
        }
        // Reload to see the changes
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };
  
  return (
    <div className="p-8">
      <div className="bg-white p-6 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-4">Test Auth - LocalStorage:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm mb-4">
          {JSON.stringify(userData, null, 2)}
        </pre>
        
        {apiResponse && (
          <div className="mb-4">
            <h3 className="font-bold">API Response:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button 
            onClick={() => testApiLogin("admin", "admin123")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test API Admin Login
          </button>
          <button 
            onClick={() => testApiLogin("hotel1", "hotel123")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test API Hotel Login
          </button>
          <button 
            onClick={() => testApiLogin("merchant1", "merchant123")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Test API Merchant Login
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <button 
            onClick={() => window.location.href = "/admin"}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Go to Admin
          </button>
          <button 
            onClick={() => window.location.href = "/hotel"}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Go to Hotel
          </button>
          <button 
            onClick={() => window.location.href = "/merchant"}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Go to Merchant
          </button>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Clear Storage
          </button>
        </div>
      </div>
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
