import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "./useSession";
import { CHAT_HISTORY_QUERY_KEY } from "../chat/useChatHistory";
import { useNavigate } from "react-router";
import { unwrapError } from "@/lib/toast";
import { toast } from "sonner";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { supabase, setSession } = useSession();

  return useMutation({
    mutationFn: async () => {
      toast.promise(supabase.auth.signOut(), {
        loading: "Loading...",
        success: () => {
          setSession(null);
          queryClient.removeQueries({
            queryKey: CHAT_HISTORY_QUERY_KEY,
          });
          navigate("/");

          return "Logged out!";
        },
        error: unwrapError,
      });
    },
  });
}
