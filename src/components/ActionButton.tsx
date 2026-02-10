import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";

type ActionButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function ActionButton({ children, className, ...props }: ActionButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "w-10 h-10 bg-black/30 backdrop-blur-md hover:bg-black/50 rounded-full flex items-center justify-center border border-white/10 transition-all",
        className
      )}
    >
      {children}
    </button>
  );
}

export default ActionButton;
