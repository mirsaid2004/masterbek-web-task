import { useEffect, useRef, useCallback } from "react";
import type { AppState } from "../types";

interface UseSpeechRecognitionProps {
  onMatch: (state: AppState) => void;
  onTranscript: (text: string) => void;
  onError: () => void;
}

export const useSpeechRecognition = ({
  onMatch,
  onTranscript,
  onError,
}: UseSpeechRecognitionProps) => {
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    // Check if Speech Recognition is available
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    // Initialize recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      onTranscript(transcript);

      // Match keywords to states
      if (transcript.includes("weather") || transcript.includes("today")) {
        onMatch("WEATHER");
      } else if (transcript.includes("bye") || transcript.includes("goodbye")) {
        onMatch("GOODBYE");
      } else if (transcript.includes("hello") || transcript.includes("hi")) {
        onMatch("GREETING");
      } else {
        onMatch("GENERAL");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech" && event.error !== "aborted") {
        onError();
      }
      isListeningRef.current = false;
    };

    recognition.onend = () => {
      isListeningRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onMatch, onTranscript, onError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListeningRef.current) {
      try {
        recognitionRef.current.start();
        isListeningRef.current = true;
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
        isListeningRef.current = false;
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  }, []);

  return { startListening, stopListening, isListening: isListeningRef.current };
};
