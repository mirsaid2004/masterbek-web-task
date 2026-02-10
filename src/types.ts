export type AppState =
  | "IDLE"
  | "GREETING"
  | "LISTENING"
  | "WEATHER"
  | "GENERAL"
  | "GOODBYE"
  | "FALLBACK"
  | "PROMPT";

export const VIDEO_FILES: Record<AppState, string> = {
  IDLE: "/videos/idle.mp4",
  GREETING: "/videos/greeting.mp4",
  LISTENING: "/videos/listening.mp4",
  WEATHER: "/videos/weather.mp4",
  GENERAL: "/videos/general_response.mp4",
  GOODBYE: "/videos/goodbye.mp4",
  FALLBACK: "/videos/fallback.mp4",
  PROMPT: "/videos/prompt.mp4",
};

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
