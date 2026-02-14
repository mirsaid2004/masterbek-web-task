import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AppState } from "@/types";
import { VIDEO_FILES } from "@/constants/video-files";

interface VideoCacheContextValue {
  isLoading: Partial<Record<AppState, boolean>>;
  loadVideos: (states: AppState[]) => Promise<void>;
  getVideo: (state: AppState) => HTMLVideoElement | null;
}

const VideoCacheContext = createContext<VideoCacheContextValue | undefined>(
  undefined
);

export function VideoCacheProvider({ children }: { children: ReactNode }) {
  const videoCacheRef = useRef<Map<AppState, HTMLVideoElement>>(new Map());
  const pendingVideosRef = useRef<Set<AppState>>(new Set());
  const [isLoading, setIsLoading] = useState<
    Partial<Record<AppState, boolean>>
  >({});

  const loadVideos = useCallback(async (states: AppState[]) => {
    setIsLoading((prev) => ({
      ...prev,
      ...states.reduce((acc, state) => ({ ...acc, [state]: true }), {}),
    }));

    const loadPromises = states.map((state) => {
      return new Promise<void>((resolve) => {
        // Skip if already cached or currently loading
        if (
          videoCacheRef.current.has(state) ||
          pendingVideosRef.current.has(state)
        ) {
          if (videoCacheRef.current.has(state)) {
            setIsLoading((prev) => ({ ...prev, [state]: false }));
          }
          resolve();
          return;
        }

        // Mark as pending
        pendingVideosRef.current.add(state);

        const video = document.createElement("video");
        video.src = VIDEO_FILES[state];
        video.preload = "auto";
        video.muted = false;
        video.playsInline = true;
        video.crossOrigin = "anonymous";
        video.style.display = "none";
        document.body.appendChild(video);

        const handleCanPlayThrough = () => {
          pendingVideosRef.current.delete(state);
          videoCacheRef.current.set(state, video);
          setIsLoading((prev) => ({ ...prev, [state]: false }));
          video.removeEventListener("canplaythrough", handleCanPlayThrough);
          resolve();
        };

        const handleError = () => {
          pendingVideosRef.current.delete(state);
          console.error(`Failed to load video: ${state}`);
          setIsLoading((prev) => ({ ...prev, [state]: false }));
          video.removeEventListener("error", handleError);
          // Remove the failed video element
          if (document.body.contains(video)) {
            document.body.removeChild(video);
          }
          resolve();
        };

        video.addEventListener("canplaythrough", handleCanPlayThrough, {
          once: true,
        });
        video.addEventListener("error", handleError, { once: true });

        video.load();
      });
    });

    await Promise.all(loadPromises);
  }, []);

  const getVideo = useCallback(
    (state: AppState) => videoCacheRef.current.get(state) || null,
    []
  );

  return (
    <VideoCacheContext.Provider value={{ isLoading, loadVideos, getVideo }}>
      {children}
    </VideoCacheContext.Provider>
  );
}

export function useVideoCache() {
  const context = useContext(VideoCacheContext);
  if (!context) {
    throw new Error("useVideoCache must be used within VideoCacheProvider");
  }
  return context;
}
