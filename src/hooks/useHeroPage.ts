import type { AppState } from "@/types";
import { useNavigate } from "react-router-dom";
import useVideoLoader from "./useVideoLoader";

const initialVideos = ["GREETING", "LISTENING"] as AppState[];

export default function useHeroPage() {
  const navigate = useNavigate();

  const handleStartConversation = () => {
    navigate("/chat");
  };

  useVideoLoader(initialVideos);

  return {
    handleStartConversation,
  };
}
