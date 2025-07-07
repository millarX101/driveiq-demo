import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import EmployeeForm from "./EmployeeForm";
import Confirmation from "./Confirmation";
import Dashboard    from "./components/Dashboard";
import Login        from "./Login";
import Protected    from "./Protected";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<EmployeeForm />} />
        <Route path="/thanks"  element={<Confirmation />} />
        <Route path="/login"   element={<Login />} />
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
