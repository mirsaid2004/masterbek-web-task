import type { AppState } from "../../types";
import { useTheatre } from "../../context/TheatreContext";
import { cn } from "../../lib/utils";

interface TheaterStatusProps {
  state: AppState;
  transcript?: string;
}

function TheaterStatus({ state, transcript }: TheaterStatusProps) {
  const { glassmorphismClasses } = useTheatre();

  const getStatusMessage = () => {
    if (state === "LISTENING" && !transcript) {
      return '"Listening..."';
    }
    if (transcript) {
      return `"${transcript}"`;
    }
    if (state === "GREETING") {
      return "Greeting you...";
    }
    if (state === "WEATHER") {
      return "Checking the weather...";
    }
    if (state === "GENERAL") {
      return "Thinking...";
    }
    if (state === "PROMPT") {
      return "Are you still there?";
    }
    if (state === "GOODBYE") {
      return "Saying goodbye...";
    }
    return "Ready...";
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4">
      <div
        className={cn(
          "backdrop-blur-md px-8 py-4 rounded-2xl border min-w-[300px] max-w-2xl",
          glassmorphismClasses
        )}
      >
        <div className="text-center">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
            STATUS
          </p>
          <p className="text-white text-lg italic">{getStatusMessage()}</p>
        </div>
      </div>
    </div>
  );
}

export default TheaterStatus;
