// src/Confirmation.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Confirmation() {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const companyId = params.get("company") || localStorage.getItem("driveiq_company");

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center px-4 text-center">
      <img
        src="https://static.wixstatic.com/media/9c690e_928771acf5c542a9923974c484f0f57e~mv2.png"
        alt="millarX DriveIQ"
        className="h-16 mb-6"
      />
      <h1 className="text-2xl font-bold text-purple-800 mb-2">Thanks for your submission!</h1>
      <p className="text-gray-600 mb-6">Your vehicle data has been securely recorded.</p>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/employee-login")}
          className="bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800 font-semibold"
        >
          Access My Dashboard
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/form?company=${companyId}`)}
            className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700"
          >
            Enter Another Car
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>
      </div>

      <footer className="text-xs text-gray-500 mt-8">
        © {new Date().getFullYear()} millarX • Scope 3 Reporting Pilot
      </footer>
    </div>
  );
}
