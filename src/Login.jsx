//  src/Login.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const savedCompany = localStorage.getItem("driveiq_company") || "bens"; // fallback

// Simple admin credentials (in production, this should be more secure)
const ADMIN_CREDENTIALS = {
  email: "admin@millarx.com",
  password: "admin123"
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();

  /* where to go after login */
  const redirectTo =
    new URLSearchParams(search).get("redirect") ||
    `/dashboard?company=${savedCompany}`;

  /* check if already logged in */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("driveiq_admin_logged_in");
    if (isLoggedIn === "true") {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  /* handle admin login */
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple credential check
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Set login state
      localStorage.setItem("driveiq_admin_logged_in", "true");
      localStorage.setItem("driveiq_admin_email", email);
      
      // Redirect to dashboard
      navigate(redirectTo, { replace: true });
    } else {
      setError("Invalid email or password");
    }
    
    setIsLoading(false);
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

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <input
              type="email"
              required
              placeholder="admin@millarx.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-purple-700 text-white rounded hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-xs text-gray-500 text-center">
          Demo credentials: admin@millarx.com / admin123
        </div>
      </div>
    </div>
  );
}
