import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);
  const navigate          = useNavigate();
  const { search }        = useLocation();
  const redirectTo        = new URLSearchParams(search).get("redirect") || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return alert(error.message);
    setSent(true);
  };

  // if already logged in, bounce straight to target
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) navigate(redirectTo, { replace:true });
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-5">
        <img src="https://static.wixstatic.com/media/9c690e_928771acf5c542a9923974c484f0f57e~mv2.png"
             alt="millarX" className="h-10 mx-auto" />

        <h1 className="text-lg font-bold text-center text-purple-800">
          millarX DriveIQ Login
        </h1>

        {sent ? (
          <p className="text-center text-sm">
            Check your inbox – we sent you a magic login link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
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
