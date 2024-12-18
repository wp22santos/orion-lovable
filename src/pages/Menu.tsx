import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Menu = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4">
      <h1 className="text-xl font-semibold mb-6">Menu</h1>
      
      <div className="space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Menu;