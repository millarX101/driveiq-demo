import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatNumber } from "./components/formatters";

export default function EmployeeForm() {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState("");

  // ------------- Form State -------------
  const [form, setForm] = useState({
    employeeId: "",
    vehicleType: "",
    fuelType: "Petrol",
    kmPerYear: 15000,
    fuelEfficiency: 7.5,
    businessUse: 0,
    hasNovated: false
  });

  // ------------- Grab company ID from URL or fallback to demo -------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cid = params.get("company");
    const isDemo = params.get("demo") === "true";

    if (cid) {
      setCompanyId(cid);
      localStorage.setItem("driveiq_company", cid);
    } else if (isDemo) {
      setCompanyId("bens");
      localStorage.setItem("driveiq_company", "bens");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const record = {
      ...form,
      companyId,
      kmPerYear: +form.kmPerYear,
      fuelEfficiency: +form.fuelEfficiency,
      businessUse: +form.businessUse,
      hasNovated: form.hasNovated
    };

    try {
      const { error } = await supabase.from("submissions").insert([record]);
      if (error) throw error;
      navigate(`/thanks?company=${companyId}`);
    } catch (err) {
      console.error(err);
      alert("Submission failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 text-gray-900 flex flex-col">
      <header className="bg-white shadow-md py-4 px-6 flex items-center gap-3">
        <img
          src="https://static.wixstatic.com/media/9c690e_928771acf5c542a9923974c484f0f57e~mv2.png"
          alt="millarX DriveIQ"
          className="h-10"
        />
        <div>
          <h1 className="text-xl font-bold text-purple-800">
            millarX&nbsp;DriveIQ – Vehicle Entry
          </h1>
          <p className="text-sm text-gray-500">
            Helping employers track Scope&nbsp;3 and Grey-Fleet Scope&nbsp;2
          </p>
        </div>
      </header>

      <main className="flex-grow max-w-md mx-auto py-8 px-4">
        {!companyId && (
          <p className="text-red-600 mb-4">
            Missing company ID in link. Use <code>?company=xyz</code> or try <code>?demo=true</code>.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-xl shadow-md"
        >
          {/* basic inputs */}
          {[
            {
              label: "Employee ID or Initials",
              name: "employeeId",
              type: "text"
            },
            {
              label: "Vehicle Type (e.g. Corolla Hybrid)",
              name: "vehicleType",
              type: "text"
            },
            {
              label: "Estimated KM per Year",
              name: "kmPerYear",
              type: "number"
            },
            {
              label: `Fuel Efficiency (${form.fuelType === "EV" ? "kWh/100km" : "L/100km"})`,
              name: "fuelEfficiency",
              type: "number",
              step: "0.1"
            }
          ].map((f) => (
            <div key={f.name}>
              <label className="block mb-1 font-medium">{f.label}</label>
              <input
                {...f}
                value={form[f.name]}
                onChange={handleChange}
                className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
          ))}

          {/* fuel type */}
          <div>
            <label className="block mb-1 font-medium">Fuel Type</label>
            <select
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-purple-600"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="EV">EV</option>
            </select>
          </div>

          {/* business-use radio */}
          <div>
            <label className="block mb-1 font-medium">
              Did you claim business use for this car on your tax return?
            </label>
            <div className="flex gap-6 mb-3">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="hasBusiness"
                  value="no"
                  checked={form.businessUse === 0}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, businessUse: 0 }))
                  }
                />
                No
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="hasBusiness"
                  value="yes"
                  checked={form.businessUse !== 0}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, businessUse: 50 }))
                  }
                />
                Yes
              </label>
            </div>

            {form.businessUse !== 0 && (
              <input
                type="number"
                name="businessUse"
                min="1"
                max="100"
                value={form.businessUse}
                onChange={handleChange}
                className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-purple-600"
                placeholder="Enter business-use %"
                required
              />
            )}
          </div>

          {/* novated lease radio */}
          <div>
            <label className="block mb-1 font-medium">
              Is this car on a novated lease?
            </label>
            <div className="flex gap-6 mb-3">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="hasNovated"
                  value="no"
                  checked={!form.hasNovated}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, hasNovated: false }))
                  }
                />
                No
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="hasNovated"
                  value="yes"
                  checked={form.hasNovated}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, hasNovated: true }))
                  }
                />
                Yes
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!companyId}
            className="w-full py-3 bg-purple-700 text-white font-semibold rounded hover:bg-purple-800 transition disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </main>

      <footer className="text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} millarX • Scope 3 Reporting Pilot
      </footer>
    </div>
  );
}
