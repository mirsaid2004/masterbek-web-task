import { Fullscreen, Loader, X } from "lucide-react";
import Theater from "../components/Theater";
import InteractionModal from "../components/InteractionModal";
import { useChatPage } from "../hooks/useChatPage";
import { cn } from "@/lib/utils";
import { handleFullscreen } from "@/lib/full-screen";
import { VIDEO_FILES } from "@/constants/video-files";

function ChatPage() {
  const {
    chatState,
    transcript,
    primaryVideoRef,
    bufferVideoRef,
    isPrimaryVisible,
    isLoading,
    showInteractionModal,
    handleVideoEnd,
    handleInteraction,
    handleExit,
  } = useChatPage();

  const isCurrentVideoLoading = isLoading[chatState];

  const primaryVideoClasses = cn(
    "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
    isPrimaryVisible ? "opacity-100" : "opacity-0 pointer-events-none"
  );

  const bufferVideoClasses = cn(
    "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
    !isPrimaryVisible ? "opacity-100" : "opacity-0 pointer-events-none"
  );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Primary Video - Visible by default */}
      <video
        ref={primaryVideoRef}
        className={primaryVideoClasses}
        src={VIDEO_FILES.GREETING}
        preload="auto"
        autoPlay
        muted={false}
        playsInline
        onEnded={isPrimaryVisible ? handleVideoEnd : undefined}
      />

      {/* Buffer Video - Hidden, preloading next video */}
      <video
        ref={bufferVideoRef}
        className={bufferVideoClasses}
        autoPlay
        preload="auto"
        muted={false}
        playsInline
        onEnded={!isPrimaryVisible ? handleVideoEnd : undefined}
      />

      {/* Loading Overlay - Shows when current video is not ready */}
      {isCurrentVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-40">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-cyan-400 animate-spin" />
            <p className="text-white/70 text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Interaction Modal - Shows on page refresh */}
      {showInteractionModal && (
        <InteractionModal onInteract={handleInteraction} />
      )}

      {/* Theater Overlay UI */}
      <Theater glassmorphismTheme="dark">
        <Theater.TopBar>
          <Theater.Badge />

          <Theater.Actions>
            <Theater.ActionButton onClick={handleFullscreen}>
              <Fullscreen className="w-5 h-5 text-white" />
            </Theater.ActionButton>

            <Theater.ActionButton
              onClick={handleExit}
              className="hover:bg-red-500/50"
            >
              <X className="w-5 h-5 text-white" />
            </Theater.ActionButton>
          </Theater.Actions>
        </Theater.TopBar>

        <Theater.Status state={chatState} transcript={transcript} />

        <Theater.Microphone isActive={chatState === "LISTENING"} />
      </Theater>
    </div>
  );
}

export default ChatPage;
