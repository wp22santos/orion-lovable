import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { TopNavigation } from "@/components/TopNavigation";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ApproachDetails from "./pages/ApproachDetails";
import PersonProfile from "./pages/PersonProfile";
import NovaAbordagem from "./pages/NovaAbordagem";
import EditPerson from "./pages/EditPerson";

const queryClient = new QueryClient();

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

  // Redirect to home if user is authenticated and tries to access login
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      {isAuthenticated && (
        <>
          <TopNavigation />
          <FloatingActionButton />
        </>
      )}
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