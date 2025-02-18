import React, { useRef } from "react";

import { cn } from "@/lib/utils";

const useAutoResizeTextarea = (
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  React.useImperativeHandle(ref, () => textAreaRef.current!);

  React.useEffect(() => {
    const ref = textAreaRef?.current;

    const updateTextareaHeight = () => {
      if (!ref || ref?.scrollHeight >= 100) return;
      if (ref && !ref?.value) {
        ref.style.height = "auto";
        return;
      }
      ref.style.height = "auto";
      ref.style.height = ref?.scrollHeight + "px";
    };

    ref?.addEventListener("input", updateTextareaHeight);

    return () => ref?.removeEventListener("input", updateTextareaHeight);
  }, [ref]);

  return { textAreaRef };
};

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  const { textAreaRef } = useAutoResizeTextarea(ref);
  return (
    <textarea
      className={cn(
        "flex w-full pb-[1px] h-8 rounded-md border border-input hover:border-primary bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:placeholder:text-muted-foreground",
        className,
      )}
      ref={textAreaRef}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
