import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export function Center({ className, children }: Props) {
  return (
    <div
      className={cn("flex justify-center items-center h-dvh w-dvw", className)}
    >
      {children}
    </div>
  );
}
