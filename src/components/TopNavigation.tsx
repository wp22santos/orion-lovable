import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

export const TopNavigation = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    signOut?.();
    navigate("/login");
  };

  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Button
                  variant="ghost"
                  className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {!isHome && (
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-800">
              {location.pathname.includes('nova-abordagem') ? 'Nova Abordagem' : 
               location.pathname.includes('approach') ? 'Detalhes da Abordagem' :
               location.pathname.includes('person') ? 'Perfil do Abordado' : ''}
            </h1>
          </div>
        )}

        <div className="w-10" /> {/* Spacer for alignment */}
      </div>
    </header>
  );
};