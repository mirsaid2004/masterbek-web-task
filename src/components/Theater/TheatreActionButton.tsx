import { useTheatre } from "@/context/TheatreContext";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type TheatreActionButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function TheatreActionButton({
  children,
  className,
  ...props
}: TheatreActionButtonProps) {
  const { glassmorphismClasses } = useTheatre();

  return (
    <button
      {...props}
      className={cn(
        "w-10 h-10 backdrop-blur-md hover:bg-black/50 rounded-full flex items-center justify-center border transition-all",
        glassmorphismClasses,
        className
      )}
    >
      {children}
    </button>
  );
}

export default TheatreActionButton;
