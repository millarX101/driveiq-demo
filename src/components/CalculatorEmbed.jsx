import React from "react";

/**
 * Simple wrapper that shows the external leasing-engine site in an iframe.
 * Feel free to style / tweak height etc.
 */
export default function CalculatorEmbed() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow px-6 py-4 text-purple-800 font-bold">
        millarX • Self-Serve Lease Calculator
      </header>

      <iframe
        title="Lease Calculator"
        src="https://leasingengine.netlify.app/"
        className="flex-grow w-full"
        style={{ minHeight: "calc(100vh - 4rem)" }}   /* header height fallback */
      />
    </div>
  );
}
