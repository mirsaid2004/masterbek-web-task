import { Mic } from "lucide-react";

type TheaterMicrophoneProps = {
  isActive?: boolean;
};

function TheaterMicrophone({ isActive = false }: TheaterMicrophoneProps) {
  if (!isActive) return null;

  return (
    <div className="absolute bottom-8 right-8 pointer-events-none">
      <div className="relative flex flex-col items-center">
        {/* Pulsing Animation */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-40"></div>
          <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-60"></div>

          {/* Microphone Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20">
              <Mic className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Active Label */}
        <span className="mt-2 text-white text-xs font-semibold uppercase tracking-wider bg-red-600/80 px-3 py-1 rounded-full">
          ACTIVE
        </span>
      </div>
    </div>
  );
}

export default TheaterMicrophone;
