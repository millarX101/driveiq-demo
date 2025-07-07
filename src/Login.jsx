//  src/Login.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const savedCompany = localStorage.getItem("driveiq_company") || "bens"; // fallback
export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  const { search } = useLocation();
  const navigate   = useNavigate();

  /* where to go after login */
const redirectTo =
  new URLSearchParams(search).get("redirect") ||
  `/dashboard?company=${savedCompany}`;

  /* if already signed-in, jump straight to dashboard */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate(redirectTo, { replace: true });
    });
  }, []);

  /* send magic-link */
  const signIn = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login?redirect=${encodeURIComponent(
          redirectTo
        )}`,
      },
    });
    if (error) return alert(error.message);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-5">
        <img
          src="https://static.wixstatic.com/media/9c690e_928771acf5c542a9923974c484f0f57e~mv2.png"
          alt="millarX DriveIQ"
          className="h-10 mx-auto"
        />

        <h1 className="text-lg font-bold text-center text-purple-800">
          DriveIQ Dashboard Login
        </h1>

        {sent ? (
          <p className="text-center text-sm">
            We’ve emailed you a secure login link.<br />Check your inbox.
          </p>
        ) : (
          <form onSubmit={signIn} className="space-y-3">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded"
            />
            <button
              type="submit"
              className="w-full py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            >
              Send Magic Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
