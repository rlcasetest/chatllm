import { useMutation } from "@tanstack/react-query";
import { useSession } from "./useSession";
import { handleError } from "@/lib/toast";

type LoginRequest = {
  email: string;
  password: string;
};

export function useLogin() {
  const { supabase, setSession } = useSession();

  return useMutation({
    mutationFn: async (request: LoginRequest) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword(request);
        if (error) throw new Error(error.message);
        setSession(data.session);

        return data;
      } catch (error) {
        handleError(error);
      }
    },
  });
}
