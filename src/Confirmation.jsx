import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const companyId = query.get("company");

  return (
    <div className="min-h-screen bg-purple-50 text-gray-900 flex flex-col items-center justify-center px-6">
      <img
        src="https://static.wixstatic.com/media/9c690e_928771acf5c542a9923974c484f0f57e~mv2.png"
        alt="millarX"
        className="h-14 mb-4"
      />
      <h1 className="text-2xl font-bold text-purple-800 mb-2">
        Thanks for your submission!
      </h1>
      <p className="text-center text-gray-600 max-w-md mb-6">
        Your entry helps your company measure and reduce Scope 3 vehicle emissions.
        Thanks for being part of the journey toward a cleaner transport future.
      </p>

      {companyId && (
        <Link
          to={`/?company=${companyId}`}
          className="inline-block bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800 transition"
        >
          Have more than one car in the family? Please enter another submission
        </Link>
      )}
    </div>
  );
}
