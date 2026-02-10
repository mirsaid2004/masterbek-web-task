import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { AppState } from "../types";
import { VIDEO_FILES } from "../types";
import { useSpeechRecognition } from "./useSpeechRecognition";

export function useChatPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AppState>("GREETING");
  const [transcript, setTranscript] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<string>(
    VIDEO_FILES.GREETING
  );

  // Dual video buffer refs
  const primaryVideoRef = useRef<HTMLVideoElement>(null);
  const bufferVideoRef = useRef<HTMLVideoElement>(null);
  const [isPrimaryVisible, setIsPrimaryVisible] = useState(true);

  // Track the state of the video that's currently visible
  const currentStateRef = useRef<AppState>("GREETING");

  // Silence detection timer
  const silenceTimerRef = useRef<number | null>(null);

  // Modal state for page refresh
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  // Check video is paused
  useEffect(() => {
    const checkVideoPlaying = () => {
      const video = primaryVideoRef.current;
      if (video) {
        const isPlaying = !video.paused && !video.ended && video.readyState > 2;

        if (!isPlaying) {
          setShowInteractionModal(true);
        }
      }
    };

    // Small delay to let video attempt autoplay
    const timer = setTimeout(checkVideoPlaying, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle user interaction to start video
  const handleInteraction = useCallback(() => {
    setShowInteractionModal(false);

    // Play the primary video after user interaction
    if (primaryVideoRef.current) {
      primaryVideoRef.current.play().catch((error) => {
        console.error("Failed to play video after interaction:", error);
      });
    }
  }, []);

  // Handle state transitions based on speech
  const handleSpeechMatch = useCallback((newState: AppState) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setState(newState);
  }, []);

  const handleTranscript = useCallback((text: string) => {
    setTranscript(text);
  }, []);

  const handleSpeechError = useCallback(() => {
    setState("FALLBACK");
  }, []);

  const { startListening, stopListening } = useSpeechRecognition({
    onMatch: handleSpeechMatch,
    onTranscript: handleTranscript,
    onError: handleSpeechError,
  });

  // Handle video state changes with double buffer
  useEffect(() => {
    const newVideoSrc = VIDEO_FILES[state];

    if (newVideoSrc !== currentVideo) {
      setCurrentVideo(newVideoSrc);

      const bufferVideo = isPrimaryVisible
        ? bufferVideoRef.current
        : primaryVideoRef.current;

      if (bufferVideo) {
        bufferVideo.src = newVideoSrc;
        bufferVideo.load();

        bufferVideo.oncanplaythrough = () => {
          // Update the current state ref when video becomes visible
          currentStateRef.current = state;

          // Swap videos with smooth transition
          setIsPrimaryVisible(!isPrimaryVisible);

          bufferVideo.play().catch((error) => {
            console.error("Failed to play buffer video:", error);
          });
        };
      }
    }
  }, [state, currentVideo, isPrimaryVisible]);

  // Handle LISTENING state with silence detection
  useEffect(() => {
    if (state === "LISTENING") {
      startListening();

      // Set 8-second silence timer
      silenceTimerRef.current = window.setTimeout(() => {
        stopListening();
        setState("PROMPT");
      }, 8000);

      return () => {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      };
    } else {
      stopListening();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    }
  }, [state, startListening, stopListening]);

  // Handle video end events
  const handleVideoEnd = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const videoElement = e.currentTarget;

      // Only process if this is the currently visible video
      const isVisible =
        (videoElement === primaryVideoRef.current && isPrimaryVisible) ||
        (videoElement === bufferVideoRef.current && !isPrimaryVisible);

      if (!isVisible) {
        return;
      }

      // Check which state this video represents
      const endedState = currentStateRef.current;

      if (
        endedState === "GREETING" ||
        endedState === "WEATHER" ||
        endedState === "GENERAL" ||
        endedState === "FALLBACK" ||
        endedState === "PROMPT"
      ) {
        setState("LISTENING");
        setTranscript("");
      } else if (endedState === "GOODBYE") {
        // Only navigate when the GOODBYE video actually finishes
        navigate("/");
      }
    },
    [isPrimaryVisible, navigate]
  );

  const handleExit = useCallback(() => {
    setState("GOODBYE");
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  return {
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
  };
}
