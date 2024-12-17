import { ApproachCard } from "@/components/ApproachCard";
import type { Approach } from "@/services/indexedDB";

interface ApproachListProps {
  approaches: Approach[];
  onApproachClick: (id: string) => void;
}

export const ApproachList = ({ approaches, onApproachClick }: ApproachListProps) => {
  if (approaches.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        Nenhuma abordagem encontrada
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {approaches.map((approach) => (
        <ApproachCard
          key={approach.id}
          approach={approach}
          onClick={onApproachClick}
        />
      ))}
    </div>
  );
};