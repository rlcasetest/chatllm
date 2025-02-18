import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";
import { useLocation, useNavigate } from "react-router";
import { handleError } from "@/lib/toast";
import { env } from "@/utils/env";
import { Loading } from "@/components/helpers/loading";

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_KEY);

// Context needs to be used here to share and synchronize the same value throughout the application.
const SessionContext = createContext<Return>({
  isLoading: true,
  supabase,
  setSession: () => void 0, // Placeholder function
});

type Props = {
  children: ReactNode;
};
type Return = {
  supabase: SupabaseClient;
  session?: Session | null;
  setSession: (session: Session | null) => void;
  jwt?: string;
  isLoading: boolean;
};

/**
 * Wrapper around `supabase` `auth`.
 *
 * Handle the full lifecycle of a session, from login to logout and refreshing it.
 */
export function SessionProvider({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  // Session state
  const [jwt, setJwt] = useState<string | undefined>();
  const [session, _setSession] = useState<Session | null>(null);
  const [isLoading, setLoading] = useState(true);

  const clearUserData = useCallback(() => {
    _setSession(null);
    setJwt(undefined);
    localStorage.removeItem("refresh-token");
  }, []);

  // Tries to get the current session.
  // Skips logic when user is already trying to logging in (`/login` page).
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        const allowedPages = ["/login", "/register"];
        const isPageAllowed = allowedPages.includes(location?.pathname);
        const noSession = session === null;
        if (isPageAllowed && noSession) {
          return;
        } else if (!isPageAllowed && noSession) {
          navigate("/login");
          return;
        } else {
          _setSession(session);
          setLoading(false);

          if (session?.refresh_token)
            localStorage.setItem("refresh-token", session.refresh_token);
        }
      })
      // If it can't get a new session, it notifies the user and clears the cache.
      // This avoids out of sync variables.
      .catch((error) => {
        handleError(error);
        clearUserData();
      });

    // If the auth state changes, we update our cache with the new values.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      _setSession(session);
      setLoading(false);

      if (session?.refresh_token)
        localStorage.setItem("refresh-token", session.refresh_token);
      else if (session?.access_token) setJwt(session.access_token);
      else clearUserData(); // clears cache if it's a false positive
    });

    return () => subscription.unsubscribe();
  }, [clearUserData, location?.pathname, navigate]);

  // Handles the case where we don't have a session but we can use our cached refresh token to generate a new one.
  // This usually happens when refreshing the page.
  // We could cache the session instead, but the session object is pretty big and full of personal information.
  useEffect(() => {
    const refreshToken = localStorage.getItem("refresh-token");
    if (session || !refreshToken) return;

    setLoading(true);
    supabase.auth
      .refreshSession({
        refresh_token: refreshToken,
      })
      .then(({ data, error }) => {
        if (error || !data?.session) return;
        _setSession(data.session);
        setJwt(data.session.access_token);
        localStorage.setItem("refresh-token", data.session.refresh_token);
        setLoading(false);
      })
      .catch((error) => {
        // If something fails, we clear the cache. This is important to prevent infinite loops of trying to refresh a
        // session that can't be refreshed.
        handleError(error);
        clearUserData();
      });
  }, [clearUserData, isLoading, jwt, session]);

  const setSession = (session: Session | null) => {
    if (!session) return;

    _setSession(session);
    setJwt(session.access_token);
  };

  // Blocks/hides the UI while we don't know enough about the application's state
  if (isLoading) return <Loading />;

  return (
    <SessionContext.Provider
      value={{ session, setSession, supabase, jwt, isLoading }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);

  return session;
}
