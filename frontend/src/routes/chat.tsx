import { Chat } from "@/components/chat/chat";
import { ChatMessage } from "@/components/chat/chat-message";
import { Layout } from "@/components/helpers/layout";
import { Loading } from "@/components/helpers/loading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/hooks/auth/useSession";
import { useSendMessage } from "@/hooks/chat/useSendMessage";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { SendHorizonal } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  message: string;
};

export function ChatPage() {
  const { isLoading: isLoadingSession } = useSession();
  const [isGeneratingMessage, setGeneratingMessage] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Checks if we are either mutating or fetching data
  // The send message button will be disabled during loading.
  const isMutating = useIsMutating();
  const isFetching = useIsFetching();
  const isLoading = isMutating > 0 || isFetching > 0;

  const { mutateAsync } = useSendMessage();
  const { handleSubmit, register, reset } = useForm<Inputs>({
    shouldUnregister: true,
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    reset({ message: "" }); // Resets the message field.
    await mutateAsync(data); // Send the message.
    // After the endpoint that sends the message returns, we have the LLM message.
    setGeneratingMessage(false);
    setTimeout(() => {
      // We want for the loading component to unmount and the new data to appear, then we scroll.
      scrollToBottom();
    }, 750);
  };

  // Handles scrolling to the bottom of the chat when new messages appear.
  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bottomRef]);

  if (isLoadingSession) return <Loading />;

  return (
    <Layout>
      <form
        className="flex flex-col justify-between items-center h-dvh w-dvw px-10 py-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="h-[88vh] w-[65vw] overflow-y-auto px-4">
          <Chat />

          {isGeneratingMessage && (
            <ChatMessage
              sender="llm"
              message="Thinking..."
              isLoading={isGeneratingMessage}
            />
          )}

          {/* This `<div>` goes after `<Chat />` so we always scroll to the bottom.*/}
          <div className="mb-10" ref={bottomRef} />
        </div>

        <div className="w-full flex flex-col">
          <div className="flex justify-between p-4 items-center h-fit border border-input transition-all rounded-full mx-64">
            <Textarea
              className="py-0 border-none bg-transparent resize-none text-lg placeholder:text-lg"
              placeholder="Ask something"
              disabled={isLoading}
              {...register("message", {
                required: true,
              })}
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="rounded-[50%] bg-card transition-colors delay-100 duration-300 hover:bg-secondary-hover hover:text-card-foreground"
                    disabled={isLoading}
                    onClick={() => {
                      // Sets a flag that shows a loading message to the user while the server is generating the message.
                      setGeneratingMessage(true);
                      setTimeout(() => {
                        // After the loading messages gets mounted, we can scroll to the bottom.
                        scrollToBottom();
                      }, 500);
                    }}
                  >
                    <SendHorizonal />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </form>
    </Layout>
  );
}
