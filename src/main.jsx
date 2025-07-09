// main.jsx  (entrypoint)

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ---------- page components ---------- */
import LandingPage    from "./LandingPage";
import EmployeeForm   from "./EmployeeForm";
import Confirmation   from "./Confirmation";
import Login          from "./Login";
import Dashboard      from "./components/Dashboard";
import Protected      from "./Protected";

/*   NEW – embed the Netlify calculator inside the app   */
import CalculatorEmbed from "./components/CalculatorEmbed";

/* ---------- global styles ---------- */
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/* 🌐 Public landing */}
        <Route path="/"          element={<LandingPage />} />

        {/* 👤 Employee entry flow */}
        <Route path="/form"      element={<EmployeeForm />} />
        <Route path="/thanks"    element={<Confirmation />} />

        {/* 📊 Self-serve lease calculator */}
        <Route path="/calculator" element={<CalculatorEmbed />} />

        {/* 🔐 Employer portal (login → protected dashboard) */}
        <Route path="/login"     element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
