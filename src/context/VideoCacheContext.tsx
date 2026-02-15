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
  getVideo: (state: AppState) => string | null;
}

const VideoCacheContext = createContext<VideoCacheContextValue | undefined>(
  undefined
);

export function VideoCacheProvider({ children }: { children: ReactNode }) {
  const videoCacheRef = useRef<Map<AppState, string>>(new Map());
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

        fetch(VIDEO_FILES[state])
          .then((response) => response.blob())
          .then((blob) => {
            const videoUrl = URL.createObjectURL(blob);
            videoCacheRef.current.set(state, videoUrl);
            pendingVideosRef.current.delete(state);
            setIsLoading((prev) => ({ ...prev, [state]: false }));
            resolve();
          })
          .catch((error) => {
            console.error(`Failed to load video ${state}:`, error);
            pendingVideosRef.current.delete(state);
            setIsLoading((prev) => ({ ...prev, [state]: false }));
            resolve();
          });
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
