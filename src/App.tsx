import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { TopNavigation } from "@/components/TopNavigation";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ApproachDetails from "./pages/ApproachDetails";
import PersonProfile from "./pages/PersonProfile";
import NovaAbordagem from "./pages/NovaAbordagem";
import EditPerson from "./pages/EditPerson";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

// PWA installation prompt component
const PWAPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
      <div>
        <h3 className="font-semibold">Instalar Aplicativo</h3>
        <p className="text-sm text-gray-600">Instale para acesso rápido offline</p>
      </div>
      <Button onClick={handleInstall} className="bg-police-primary text-white">
        Instalar
      </Button>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const shouldShowFAB = !location.pathname.includes('/nova-abordagem') && 
                       !location.pathname.includes('/edit-person');

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      {isAuthenticated && <TopNavigation />}
      <main className={`${isAuthenticated ? 'pt-16' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approach/:id"
            element={
              <ProtectedRoute>
                <ApproachDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/person/:id"
            element={
              <ProtectedRoute>
                <PersonProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-person/:id"
            element={
              <ProtectedRoute>
                <EditPerson />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nova-abordagem"
            element={
              <ProtectedRoute>
                <NovaAbordagem />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {isAuthenticated && shouldShowFAB && <FloatingActionButton />}
      <PWAPrompt />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
        duration={3000}
      />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
