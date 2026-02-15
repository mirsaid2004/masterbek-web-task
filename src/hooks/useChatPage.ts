import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import type { AppState } from "../types";
import { VIDEO_FILES } from "@/constants/video-files";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useVideoCache } from "@/context/VideoCacheContext";
import useVideoLoader from "./useVideoLoader";

const additionalVideos: AppState[] = [
  "GREETING",
  "LISTENING",
  "GOODBYE",
  "GENERAL",
  "FALLBACK",
  "PROMPT",
  "WEATHER",
  "EASTER_EGG",
];

export function useChatPage() {
  const navigate = useNavigate();
  const { isLoading, getVideo } = useVideoCache();
  const [chatState, setChatState] = useState<AppState>("GREETING");
  const [transcript, setTranscript] = useState<string>("");

  // Dual video buffer refs
  const primaryVideoRef = useRef<HTMLVideoElement>(null);
  const bufferVideoRef = useRef<HTMLVideoElement>(null);
  const [isPrimaryVisible, setIsPrimaryVisible] = useState(true);

  // current state tracker refs
  const currentStateRef = useRef<AppState>("GREETING");
  const isTransitioningRef = useRef<boolean>(false);
  const currentVideoSrcRef = useRef<string>("");

  // silence detection timer
  const silenceTimerRef = useRef<number | null>(null);
  const silenceCountRef = useRef<number>(0);

  // modal state for interaction on page refresh
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  const handleInteraction = useCallback(() => {
    setShowInteractionModal(false);
    const visibleVideo = isPrimaryVisible
      ? primaryVideoRef.current
      : bufferVideoRef.current;
    if (visibleVideo) {
      visibleVideo.play().catch((error) => {
        console.error("Failed to play video:", error);
      });
    }
  }, [isPrimaryVisible]);

  // Handle video end - only process from visible video
  const handleVideoEnd = useCallback(() => {
    const endedState = currentStateRef.current;

    if (
      endedState === "GREETING" ||
      endedState === "WEATHER" ||
      endedState === "GENERAL" ||
      endedState === "FALLBACK" ||
      endedState === "PROMPT" ||
      endedState === "EASTER_EGG"
    ) {
      setChatState("LISTENING");
      setTranscript("");
    } else if (endedState === "GOODBYE") {
      navigate("/");
    }
  }, [navigate]);

  const handleExit = useCallback(() => {
    setChatState("GOODBYE");
  }, []);

  const handleSpeechMatch = useCallback((newState: AppState) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    // Reset silence count on successful match
    silenceCountRef.current = 0;
    setChatState(newState);
  }, []);

  const handleTranscript = useCallback((text: string) => {
    setTranscript(text);
  }, []);

  const handleSpeechError = useCallback(() => {
    setChatState("FALLBACK");
  }, []);

  const { startListening, stopListening } = useSpeechRecognition({
    onMatch: handleSpeechMatch,
    onTranscript: handleTranscript,
    onError: handleSpeechError,
  });

  // Effect: load all videos on mount
  useVideoLoader(additionalVideos);

  // Effect: check if video is paused (for autoplay issues)
  useEffect(() => {
    const checkVideoPlaying = () => {
      const visibleVideo = isPrimaryVisible
        ? primaryVideoRef.current
        : bufferVideoRef.current;
      if (visibleVideo) {
        const isPlaying =
          !visibleVideo.paused &&
          !visibleVideo.ended &&
          visibleVideo.readyState > 2;
        if (!isPlaying) {
          setShowInteractionModal(true);
        }
      }
    };

    const timer = setTimeout(checkVideoPlaying, 500);
    return () => clearTimeout(timer);
  }, [isPrimaryVisible]);

  // Effect: handle chat state changes with double buffer
  useLayoutEffect(() => {
    if (isTransitioningRef.current) return;

    const newVideoSrc = VIDEO_FILES[chatState];

    // Prevent reloading same video
    if (newVideoSrc === currentVideoSrcRef.current) return;

    isTransitioningRef.current = true;
    currentVideoSrcRef.current = newVideoSrc;

    // Get the buffer video (hidden one)
    const bufferVideo = isPrimaryVisible
      ? bufferVideoRef.current
      : primaryVideoRef.current;
    const visibleVideo = isPrimaryVisible
      ? primaryVideoRef.current
      : bufferVideoRef.current;

    if (!bufferVideo) {
      isTransitioningRef.current = false;
      return;
    }

    // Stop and clear the visible video to prevent conflicts
    if (visibleVideo) {
      visibleVideo.pause();
    }

    const cachedVideo = getVideo(chatState);

    if (!cachedVideo) {
      console.warn(`Video for state ${chatState} not found in cache`);
      isTransitioningRef.current = false;
      currentVideoSrcRef.current = "";
      return;
    }

    const loadAndPlayVideo = () => {
      if (!bufferVideo) return;

      bufferVideo.src = cachedVideo;
      bufferVideo.currentTime = 0;

      bufferVideo
        .play()
        .then(() => {
          currentStateRef.current = chatState;

          setIsPrimaryVisible(!isPrimaryVisible);
          isTransitioningRef.current = false;
        })
        .catch((error) => {
          console.error("Failed to play buffer video:", error);
          isTransitioningRef.current = false;
        });
    };

    loadAndPlayVideo();
  }, [chatState, getVideo, isPrimaryVisible, isLoading]);

  // Effect: handle LISTENING state with silence detection
  useEffect(() => {
    if (chatState === "LISTENING") {
      startListening();

      silenceTimerRef.current = setTimeout(() => {
        stopListening();

        if (silenceCountRef.current >= 1) {
          setChatState("GOODBYE");
        } else {
          silenceCountRef.current += 1;
          setChatState("PROMPT");
        }
      }, 10000);
    } else {
      stopListening();
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
  }, [chatState, startListening, stopListening]);

  return {
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
    getVideo,
  };
}
