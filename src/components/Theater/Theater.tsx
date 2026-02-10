import type { HTMLAttributes, ReactNode } from "react";
import { TheatreProvider } from "../../context/TheatreContext";
import { cn } from "@/lib/utils";

type TheaterProps = {
  children: ReactNode;
  glassmorphismTheme?: "light" | "dark";
} & HTMLAttributes<HTMLDivElement>;

function Theater({
  children,
  glassmorphismTheme = "dark",
  className,
  ...props
}: TheaterProps) {
  return (
    <TheatreProvider glassmorphismTheme={glassmorphismTheme}>
      <div
        className={cn("absolute inset-0 pointer-events-none", className)}
        {...props}
      >
        {children}
      </div>
    </TheatreProvider>
  );
}

export default Theater;
