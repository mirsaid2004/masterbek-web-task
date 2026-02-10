import { createContext, useContext, type ReactNode } from "react";

type GlassmorphismTheme = "light" | "dark";

interface TheatreContextValue {
  glassmorphismTheme: GlassmorphismTheme;
  glassmorphismClasses: string;
}

const TheatreContext = createContext<TheatreContextValue | undefined>(
  undefined
);

interface TheatreProviderProps {
  children: ReactNode;
  glassmorphismTheme?: GlassmorphismTheme;
}

export function TheatreProvider({
  children,
  glassmorphismTheme = "dark",
}: TheatreProviderProps) {
  const glassmorphismClasses =
    glassmorphismTheme === "light"
      ? "bg-white/10 border-white/20"
      : "bg-black/30 border-white/10";

  return (
    <TheatreContext.Provider
      value={{ glassmorphismTheme, glassmorphismClasses }}
    >
      {children}
    </TheatreContext.Provider>
  );
}

export function useTheatre() {
  const context = useContext(TheatreContext);
  if (context === undefined) {
    throw new Error("useTheatre must be used within a TheatreProvider");
  }
  return context;
}
