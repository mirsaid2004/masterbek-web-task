import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";
import { useTheatre } from "../../context/TheatreContext";

type TheaterBadgeProps = HTMLAttributes<HTMLDivElement>;

function TheaterBadge({ className, ...props }: TheaterBadgeProps) {
  const { glassmorphismClasses } = useTheatre();

  return (
    <div
      className={cn(
        "flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full border",
        glassmorphismClasses,
        className
      )}
      {...props}
    >
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-white font-semibold text-sm tracking-wider">
        LIVE
      </span>
    </div>
  );
}

export default TheaterBadge;
