import { Play } from "lucide-react";

interface InteractionModalProps {
  onInteract: () => void;
}

function InteractionModal({ onInteract }: InteractionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 max-w-md w-full border border-white/20 shadow-2xl text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <Play className="w-10 h-10 text-white" fill="white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Continue?
        </h2>

        {/* Message */}
        <p className="text-white/80 text-lg mb-8">
          Click below to resume your conversation with Hana
        </p>

        {/* Start Button */}
        <button
          onClick={onInteract}
          className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xl py-5 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Start Chat
        </button>

        {/* Note */}
        <p className="text-white/50 text-xs mt-4">
          Audio and video will start playing
        </p>
      </div>
    </div>
  );
}

export default InteractionModal;
