import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import EmployeeForm   from "./EmployeeForm";
import Confirmation   from "./Confirmation";
import Dashboard      from "./components/Dashboard";   // ⚠ lower-case path
import Login          from "./Login";                  // magic-link screen
import Protected      from "./Protected";              // tiny guard HOC

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public self-entry form */}
        <Route path="/"        element={<EmployeeForm />} />

        {/* Branded thank-you */}
        <Route path="/thanks"  element={<Confirmation />} />

        {/* Login (magic link) */}
        <Route path="/login"   element={<Login />} />

        {/* Company dashboard – guarded */}
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
