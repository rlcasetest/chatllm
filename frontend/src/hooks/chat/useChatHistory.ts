import { handleError } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "../auth/useSession";
import { env } from "@/utils/env";
import { useCallback } from "react";

type ChatMessageResponse = {
  id: string;
  sender: "user" | "llm";
  message: string;
  sent_at: string;
};

type HistoryResponse = {
  data: ChatMessageResponse[];
  count: number | null;
};

export const CHAT_HISTORY_QUERY_KEY = ["chat", "history"];

export function useChatHistory() {
  const { jwt, session, setSession } = useSession();

  const queryFn = useCallback(async () => {
    try {
      // If we every find an invalid JWT, we clean the session to force logout the user.
      if (!session?.access_token) {
        setSession(null);
        throw new Error("User could not be found.");
      }

      const response = await fetch(`${env.VITE_API_URL}/api/v1/history`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      return ((await response.json()) as HistoryResponse).data;
    } catch (error) {
      handleError(error);
    }
  }, [jwt, session?.access_token, setSession]);

  return useQuery({
    queryKey: CHAT_HISTORY_QUERY_KEY,
    queryFn,
    // Allows this query to run only if we have a valid session, which is important because the application flow currently
    // allows for this query to be triggered before a session is gathered and validated.
    enabled: !!jwt,
  });
}
