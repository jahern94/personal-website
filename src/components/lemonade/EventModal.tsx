import { GameEvent } from "@/lib/lemonade/types";

interface EventModalProps {
  event: GameEvent;
  onDismiss: () => void;
}

export default function EventModal({ event, onDismiss }: EventModalProps) {
  const iconMap: Record<string, string> = {
    heatWave: "\u{1F525}",
    healthInspector: "\u{1F50D}",
    newsCoverage: "\u{1F4F0}",
    supplyDelay: "\u{1F69A}",
    competition: "\u{1F3EA}",
    blockParty: "\u{1F389}",
    lemonShortage: "\u{1F34B}",
    celebrityVisit: "\u{1F31F}",
  };

  const borderColor =
    event.type === "positive"
      ? "border-green-300 dark:border-green-700"
      : event.type === "negative"
        ? "border-red-300 dark:border-red-700"
        : "border-amber-300 dark:border-amber-700";

  const bgColor =
    event.type === "positive"
      ? "bg-green-50 dark:bg-green-950"
      : event.type === "negative"
        ? "bg-red-50 dark:bg-red-950"
        : "bg-amber-50 dark:bg-amber-950";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`max-w-md w-full ${bgColor} rounded-2xl p-6 border-2 ${borderColor} shadow-xl`}
      >
        <div className="text-center">
          <div className="text-5xl mb-4">{iconMap[event.id] || "\u26A0\uFE0F"}</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {event.title}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">{event.description}</p>
          <button
            onClick={onDismiss}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
