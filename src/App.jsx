import React, { useState } from "react";

export default function App() {
  const [kmDriven, setKmDriven] = useState(15000);
  const [fuelType, setFuelType] = useState("Petrol");
  const [fuelEfficiency, setFuelEfficiency] = useState(7.5); // L or kWh per 100km
  const [businessUse, setBusinessUse] = useState(30); // %

  const [results, setResults] = useState(null);

  const emissionFactors = {
    Petrol: 2.31,
    Diesel: 2.66,
    EV: 0.79, // avg AU grid intensity per kWh
  };

  const calculateEmissions = () => {
    const fuelUsed = (kmDriven / 100) * fuelEfficiency;
    const totalEmissions = fuelUsed * emissionFactors[fuelType];
    const scope2 = (businessUse / 100) * totalEmissions;
    const scope3 = totalEmissions - scope2;

    setResults({
      total: totalEmissions,
      scope2,
      scope3,
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Scope 3 Emissions Calculator</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Kilometres Driven (Annual)</label>
          <input
            type="number"
            value={kmDriven}
            onChange={(e) => setKmDriven(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Fuel Type</label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="EV">EV</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Fuel Efficiency ({fuelType === "EV" ? "kWh/100km" : "L/100km"})
          </label>
          <input
            type="number"
            value={fuelEfficiency}
            onChange={(e) => setFuelEfficiency(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Business Use (%)</label>
          <input
            type="number"
            value={businessUse}
            onChange={(e) => setBusinessUse(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={calculateEmissions}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Calculate Emissions
        </button>
      </div>

      {results && (
        <div className="bg-gray-100 p-4 mt-6 rounded shadow">
          <p><strong>Total Emissions:</strong> {results.total.toFixed(2)} kg CO₂e</p>
          <p><strong>Scope 2 (Business):</strong> {results.scope2.toFixed(2)} kg CO₂e</p>
          <p><strong>Scope 3 (Private):</strong> {results.scope3.toFixed(2)} kg CO₂e</p>
        </div>
      )}
    </div>
  );
}
