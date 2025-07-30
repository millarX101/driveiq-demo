import { Link } from "react-router-dom";
export default function NavBar() {
  const company = localStorage.getItem("driveiq_company");
  return (
    <nav className="bg-white shadow px-4 py-2 flex gap-4">
      <Link to="/" className="font-semibold text-purple-700">millarX&nbsp;DriveIQ</Link>
      {company && (
        <Link
          to={`/dashboard?company=${company}`}
          className="text-sm text-gray-600 hover:text-purple-700"
        >
          Dashboard
        </Link>
      )}
      <Link
        to="/login"
        className="ml-auto text-sm text-gray-600 hover:text-purple-700"
      >
        Log&nbsp;in
      </Link>
    </nav>
  );
}
