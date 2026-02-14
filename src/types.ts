export type AppState =
  | "IDLE"
  | "GREETING"
  | "LISTENING"
  | "WEATHER"
  | "GENERAL"
  | "GOODBYE"
  | "FALLBACK"
  | "PROMPT"
  | "EASTER_EGG";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
