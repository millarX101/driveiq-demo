//  src/Protected.jsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function Protected({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  /* initial session + listener */
  useEffect(() => {
    // 1. get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // 2. listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_evt, authSession) => setSession(authSession)
    );

    // 3. clean-up (guard in case subscription is undefined)
    return () => subscription?.unsubscribe();
  }, []);

  /* still checking */
  if (loading) return null;          // or a spinner

  /* logged in → allow */
  if (session) return children;

  /* not logged in → bounce to /login  */
  const redirect = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`/login?redirect=${redirect}`} replace />;
}
