import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../auth/useSession";
import { CHAT_HISTORY_QUERY_KEY } from "./useChatHistory";
import { handleError } from "@/lib/toast";
import { env } from "@/utils/env";
import { ChatMessageProps } from "@/components/chat/chat-message";

type Message = {
  message: string;
};

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { session, setSession, jwt, supabase } = useSession();

  return useMutation({
    mutationFn: async (data: Message) => {
      // If we every find an invalid JWT, we clean the session to force logout the user.
      if (!session?.access_token) {
        setSession(null);
        throw new Error("User could not be found.");
      }

      const previousMessages = queryClient.getQueryData(CHAT_HISTORY_QUERY_KEY);
      queryClient.setQueryData<ChatMessageProps[]>(
        CHAT_HISTORY_QUERY_KEY,
        (old) => [
          ...old!,
          {
            ...data,
            sender: "user",
          },
        ],
      );

      await fetch(`${env.VITE_API_URL}/api/v1/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return { previousMessages };
    },
    onError: (err, _newMessage, context) => {
      queryClient.setQueryData(
        CHAT_HISTORY_QUERY_KEY,
        (context as { previousMessages: ChatMessageProps[] }).previousMessages,
      );
      handleError(err);
    },
    onSettled: async () => {
      // When sending a message we invalidate the history cache, this tells `@tanstack/react-query` to
      // refetch the data that was there when that component mounts again.
      // In this case, the component is still mounted so it will refetch when it can.
      await queryClient.invalidateQueries({
        queryKey: CHAT_HISTORY_QUERY_KEY,
      });

      // Because the user performed an action, we know they are "online" or active.
      // This is a good moment to refresh their session, so we don't force sign out of someone using the application.
      supabase.auth.refreshSession();
    },
  });
}
