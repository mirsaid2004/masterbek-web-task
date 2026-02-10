import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type TheatreActionsProps = {
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

function TheatreActions({
  children,
  className,
  ...props
}: TheatreActionsProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
}

export default TheatreActions;
