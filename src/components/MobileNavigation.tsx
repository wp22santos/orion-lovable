import { Menu as MenuIcon, Home, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const MobileNavigation = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut?.();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3 flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/")}
        className="hover:bg-transparent"
      >
        <Home className="h-6 w-6 text-gray-600" />
      </Button>

      <Button
        onClick={() => navigate("/nova-abordagem")}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 flex items-center gap-2"
      >
        <Plus className="h-5 w-5" />
        <span className="text-sm">Nova</span>
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <MenuIcon className="h-6 w-6 text-gray-600" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4 mt-8">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-5 w-5" />
              Início
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sair
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};