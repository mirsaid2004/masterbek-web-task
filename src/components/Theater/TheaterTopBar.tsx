import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type TheaterTopBarProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

function TheaterTopBar({ children, className, ...props }: TheaterTopBarProps) {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 flex items-center justify-between p-6 pointer-events-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default TheaterTopBar;
