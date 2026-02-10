import { Fullscreen, X } from "lucide-react";
import Theater from "../components/Theater";
import InteractionModal from "../components/InteractionModal";
import { useChatPage } from "../hooks/useChatPage";
import { cn } from "@/lib/utils";

function ChatPage() {
  const {
    state,
    transcript,
    currentVideo,
    primaryVideoRef,
    bufferVideoRef,
    isPrimaryVisible,
    showInteractionModal,
    handleVideoEnd,
    handleInteraction,
    handleExit,
    handleFullscreen,
  } = useChatPage();

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Primary Video */}
      <video
        ref={primaryVideoRef}
        className={cn(
          `absolute inset-0 w-full h-full object-cover transition-opacity duration-500`,
          isPrimaryVisible ? "opacity-100" : "opacity-0"
        )}
        src={currentVideo}
        autoPlay
        muted={false}
        loop={state === "LISTENING"}
        playsInline
        onEnded={handleVideoEnd}
      />

      {/* Buffer Video */}
      <video
        ref={bufferVideoRef}
        className={cn(
          `absolute inset-0 w-full h-full object-cover transition-opacity duration-500 `,
          !isPrimaryVisible ? "opacity-100" : "opacity-0"
        )}
        autoPlay
        muted={false}
        loop={state === "LISTENING"}
        playsInline
        onEnded={handleVideoEnd}
      />

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

        <Theater.Status state={state} transcript={transcript} />

        <Theater.Microphone isActive={state === "LISTENING"} />
      </Theater>
    </div>
  );
}

export default ChatPage;
