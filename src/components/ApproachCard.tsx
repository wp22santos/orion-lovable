import { CalendarDays, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface ApproachCardProps {
  approach: {
    id: string;
    name: string;
    date: string;
    location: string;
    companions?: string[];
    imageUrl?: string;
  };
  onClick?: (id: string) => void;
}

export const ApproachCard = ({ approach, onClick }: ApproachCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/person/${approach.id}`);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(approach.id);
    }
  };

  return (
    <Card
      className="p-3 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in bg-white border-transparent hover:border-blue-200"
      onClick={handleCardClick}
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden shadow-md flex-shrink-0">
          {approach.imageUrl ? (
            <img
              src={approach.imageUrl}
              alt={approach.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-lg font-semibold">
              {approach.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold text-base text-blue-600 hover:text-blue-800 cursor-pointer transition-colors truncate"
            onClick={handleNameClick}
          >
            {approach.name}
          </h3>
          <div className="flex flex-col gap-1 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">{approach.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">{approach.location}</span>
            </div>
            {approach.companions && approach.companions.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm truncate">{approach.companions.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};