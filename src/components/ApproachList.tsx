import { ApproachCard } from "@/components/ApproachCard";
import type { Approach } from "@/services/indexedDB";
import { motion } from "framer-motion";

interface ApproachListProps {
  approaches: Approach[];
  onApproachClick: (id: string) => void;
}

export const ApproachList = ({ approaches, onApproachClick }: ApproachListProps) => {
  if (approaches.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-medium">Nenhuma abordagem encontrada</p>
        <p className="text-sm text-gray-400">
          Tente ajustar seus filtros ou criar uma nova abordagem
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {approaches.map((approach, index) => (
        <motion.div
          key={approach.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ApproachCard
            approach={{
              id: approach.id,
              name: approach.name,
              date: approach.date,
              location: approach.location,
              companions: approach.companions,
              imageUrl: approach.imageUrl
            }}
            onClick={onApproachClick}
          />
        </motion.div>
      ))}
    </div>
  );
};