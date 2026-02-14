import { useVideoCache } from "@/context/VideoCacheContext";
import { sleep } from "@/lib/sleep";
import type { AppState } from "@/types";
import { useEffect } from "react";

export default function useVideoLoader(videos: AppState | AppState[]) {
  const { loadVideos } = useVideoCache();

  useEffect(() => {
    const handleVideoLoads = async () => {
      await sleep(200);
      await loadVideos(Array.isArray(videos) ? videos : [videos]);
    };

    handleVideoLoads();
  }, [loadVideos]);
}
