import Theater from "@/components/Theater";
import { Check, Fullscreen, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

const featurePills = [
  { id: "1", icon: Check, label: "Voice Recognition" },
  { id: "2", icon: Check, label: "HD Audio" },
  { id: "3", icon: Check, label: "Real-time AI" },
];

function HeroPage() {
  const navigate = useNavigate();

  const handleStartConversation = () => {
    navigate("/chat");
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video with Blur/Overlay */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src="/videos/idle.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Lighter overlay for better video visibility */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Theater Overlay UI */}
        <Theater glassmorphismTheme="light">
          <Theater.TopBar>
            <Theater.Badge />

            <Theater.Actions>
              <Theater.ActionButton onClick={handleFullscreen}>
                <Fullscreen className="w-5 h-5 text-white" />
              </Theater.ActionButton>
            </Theater.Actions>
          </Theater.TopBar>
        </Theater>

        {/* Welcome Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 max-w-2xl w-full border border-white/20 shadow-2xl">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-white">Welcome back,</span>
            <br />
            <span className="text-cyan-400">Master!</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-center text-lg mb-8">
            "It's a beautiful day in the meadow! Ready to chat?"
          </p>

          {/* Start Button */}
          <button
            onClick={handleStartConversation}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xl py-5 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Mic className="w-6 h-6" />
            Start Conversation
          </button>

          <p className="text-white/60 text-xs text-center mt-4">
            ENABLE AUDIO & MIC PERMISSIONS
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {featurePills.map((pill) => (
              <div
                key={pill.id}
                className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10"
              >
                <pill.icon className="w-4 h-4 text-green-400" />
                <span className="text-white/70 text-sm">{pill.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Prompt */}
        <div className="mt-8 text-white/50 text-sm">
          <span className="italic">Suggested: "How are you today, Airi?"</span>
        </div>
      </div>
    </div>
  );
}

export default HeroPage;
