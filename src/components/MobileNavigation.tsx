import { Home, UserCircle, Plus, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <nav className="flex justify-around items-center h-16">
        <button
          onClick={() => navigate("/")}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1",
            isActive("/") ? "text-blue-600" : "text-gray-600"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Início</span>
        </button>

        <button
          onClick={() => navigate("/nova-abordagem")}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-600"
        >
          <div className="bg-blue-600 rounded-full p-3 -mt-6">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs mt-1">Nova</span>
        </button>

        <button
          onClick={() => navigate("/menu")}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-600"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs">Menu</span>
        </button>
      </nav>
    </div>
  );
};