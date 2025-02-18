import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Markdown from "react-markdown";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { copyText } from "@/utils/clipboard";
import { toast } from "sonner";

export type ChatMessageProps = {
  sender: "llm" | "user";
  message: string;
  date?: string;
  isLoading?: boolean;
};

export function ChatMessage({
  sender,
  message,
  date: dateString,
  isLoading,
}: ChatMessageProps) {
  const isUser = sender === "user";
  const date = dateString ? new Date(dateString) : new Date();

  if (isUser)
    return (
      <div
        className={
          "flex flex-col items-end gap-1 w-fit min-w-[10%] max-w-[60%] self-end cursor-default"
        }
      >
        <span
          className={
            "border-black rounded-2xl rounded-br-none w-max-[60%] py-2 px-4 bg-primary"
          }
        >
          {message}
        </span>

        <span className="text-muted-foreground text-xs cursor-default selection:bg-transparent">
          {formatDistanceToNow(date, {
            addSuffix: true,
            includeSeconds: true,
          })}
        </span>
      </div>
    );

  return (
    <div className="flex gap-4 items-start">
      <img src="/logo-white.png" height={48} width={48} />

      <div className="flex flex-col gap-2">
        <span className={cn("text-lg mt-1.5", isLoading && "animate-pulse")}>
          <Markdown>{message}</Markdown>
        </span>

        {!isLoading && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm-icon"
                  variant="ghost"
                  className="text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={() => {
                    copyText(message);
                    toast.info("Copied response to clipboard");
                  }}
                >
                  <Copy />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Copy response</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
