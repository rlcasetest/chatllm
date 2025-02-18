import { useChatHistory } from "@/hooks/chat/useChatHistory";
import { ChatMessage } from "./chat-message";
import { Error } from "../helpers/error";

export function Chat() {
  const { data, isLoading, isError } = useChatHistory();

  if (isLoading) return <></>;
  if (isError) return <Error message="Could not load chat." />;

  return (
    <div className="flex flex-col gap-4">
      {data?.map((message, index) => (
        <ChatMessage
          key={`chat-message-${index}`}
          date={message.sent_at}
          message={message.message}
          sender={message.sender}
        />
      ))}

      {data?.length === 0 && (
        <div className="flex justify-center items-center py-8 font-semibold">
          <p>No messages yet</p>
        </div>
      )}
    </div>
  );
}
