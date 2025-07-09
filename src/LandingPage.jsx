import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState(false);
  const [companyId, setCompanyId] = useState("");

  // Handle demo mode toggle
  useEffect(() => {
    if (demoMode) {
      setCompanyId("bens"); // Default demo company
    } else {
      setCompanyId("");
    }
  }, [demoMode]);

  const handleEnter = (target) => {
    if (!companyId) {
      alert("Please enter or select a company ID first.");
      return;
    }

    localStorage.setItem("driveiq_company", companyId);
    navigate(`${target}?company=${companyId}`);
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center px-4 text-center">
      <img
        src="https://static.wixstatic.com/media/9c690e_928771acf5c542a9923974c484f0f57e~mv2.png"
        alt="millarX DriveIQ"
        className="h-16 mb-6"
      />

      <h1 className="text-3xl font-bold text-purple-800 mb-2">Welcome to DriveIQ</h1>
      <p className="text-gray-600 mb-6">Select your mode and destination</p>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium">Enable Demo Mode</label>
        <input
          type="checkbox"
          checked={demoMode}
          onChange={() => setDemoMode(!demoMode)}
          className="w-5 h-5"
        />
      </div>

      {demoMode ? (
        <div className="text-sm text-gray-600 mb-4">
          Using demo company ID: <strong>bens</strong>
        </div>
      ) : (
        <input
          type="text"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          placeholder="Enter your Company ID"
          className="p-3 border border-gray-300 rounded mb-4 w-full max-w-xs"
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleEnter("/form")}
          className="bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800"
        >
          Go to Employee Entry
        </button>
        <button
          onClick={() => handleEnter("/dashboard")}
          className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Go to Employer Dashboard
        </button>
         </div>
        
<div className="flex flex-col sm:flex-row gap-4 mt-10"></div>
        <button
         onClick={() => navigate("/calculator")}
        className="bg-purple-700 / text-white px-6 py-3 rounded hover:bg-orange-700"
>
         millarX Self-Serve Lease Calculator
        </button>

      <footer className="text-xs text-gray-400 mt-8">
        © {new Date().getFullYear()} millarX • Scope 3 Reporting Pilot
      </footer>
    </div>
  );
}
