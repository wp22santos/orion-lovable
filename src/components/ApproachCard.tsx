import { CalendarDays, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ApproachCardProps {
  approach: {
    id: string;
    name: string;
    date: string;
    location: string;
    companions?: string[];
    imageUrl?: string;
  };
  onClick: (id: string) => void;
}

export const ApproachCard = ({ approach, onClick }: ApproachCardProps) => {
  const navigate = useNavigate();

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/person/${approach.id}`);
  };

  return (
    <Card
      className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in bg-white border-transparent hover:border-blue-200"
      onClick={() => onClick(approach.id)}
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden shadow-md">
          {approach.imageUrl ? (
            <img
              src={approach.imageUrl}
              alt={approach.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-semibold">
              {approach.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 
            className="font-semibold text-lg text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
            onClick={handleNameClick}
          >
            {approach.name}
          </h3>
          <div className="flex flex-col gap-2 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              <span>{approach.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{approach.location}</span>
            </div>
            {approach.companions && approach.companions.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{approach.companions.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};