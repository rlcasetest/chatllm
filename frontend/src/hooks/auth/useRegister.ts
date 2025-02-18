import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "./useSession";
import { handleError } from "@/lib/toast";
import { CHAT_HISTORY_QUERY_KEY } from "../chat/useChatHistory";

type RegisterRequest = {
  email: string;
  password: string;
};

export function useRegister() {
  const queryClient = useQueryClient();
  const { supabase, setSession } = useSession();

  return useMutation({
    mutationFn: async (request: RegisterRequest) => {
      try {
        const { data, error } = await supabase.auth.signUp(request);
        if (error) throw new Error(error.message);
        setSession(data.session);
        await queryClient.invalidateQueries({
          queryKey: CHAT_HISTORY_QUERY_KEY,
        });

        return data;
      } catch (error) {
        handleError(error);
      }
    },
  });
}
