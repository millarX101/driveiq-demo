//  src/Protected.jsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function Protected({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* check admin login status */
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("driveiq_admin_logged_in");
    setIsLoggedIn(adminLoggedIn === "true");
    setLoading(false);
  }, []);

  /* still checking */
  if (loading) return null;          // or a spinner

  /* logged in → allow */
  if (isLoggedIn) return children;

  /* not logged in → bounce to /login  */
  const redirect = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`/login?redirect=${redirect}`} replace />;
}
