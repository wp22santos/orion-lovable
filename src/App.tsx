import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNavigation } from "@/components/MobileNavigation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ApproachDetails from "./pages/ApproachDetails";
import PersonProfile from "./pages/PersonProfile";
import NovaAbordagem from "./pages/NovaAbordagem";
import EditPerson from "./pages/EditPerson";
import Menu from "./pages/Menu";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen pb-16 md:pb-0">
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
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
      </Routes>
      {isAuthenticated && <MobileNavigation />}
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