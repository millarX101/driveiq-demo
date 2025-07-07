import { useState } from "react";
import { supabase } from "../supabaseClient";

const ACCU_SPOT   = 35;   // static demo
const SERVICE_FEE = 0.10; // 10 %

export default function BuyCreditsBanner({ companyId, liabilityTonnes }) {
  const [stage, setStage] = useState("quote"); // quote | confirm | done
  const [busy, setBusy]   = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (liabilityTonnes === 0) return null;

  const sellRate = ACCU_SPOT * (1 + SERVICE_FEE);
  const totalAUD = (liabilityTonnes * sellRate).toFixed(0);

  /* -------- create order row -------- */
  const submitOrder = async () => {
    setBusy(true);
    const { error } = await supabase.from("orders").insert([{
      companyId,
      tonnes: liabilityTonnes,
      pricePerTonne: sellRate,
      totalCost: totalAUD,
      status: "requested",
    }]);
    setBusy(false);
    if (error) return alert("Could not submit request.");
    setStage("done");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      {/* --- header --- */}
      <h3 className="text-lg font-semibold mb-1">Offset Grey-Fleet Carbon</h3>
      <p className="text-xs text-gray-500 mb-4">
        Lock-in a fixed price to neutralise your business-use (Scope 2) vehicle emissions.
      </p>

      {/* --- STEP INDICATOR --- */}
      <Stepper stage={stage} />

      {/* --- QUOTE view --- */}
      {stage === "quote" && (
        <>
          <p className="mb-2 text-sm">
            <b>{liabilityTonnes.toFixed(2)} t CO₂-e</b> ×
            <b> A${sellRate.toFixed(2)}/t</b>
            &nbsp;(spot&nbsp;{ACCU_SPOT} + 10 % fee)
          </p>
          <button
            onClick={() => setStage("confirm")}
            className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
          >
            Get Quote
          </button>
        </>
      )}

      {/* --- CONFIRM view --- */}
      {stage === "confirm" && (
        <>
          <p className="mb-4 text-sm text-gray-700">
            Total cost&nbsp;
            <span className="text-xl font-bold">A${totalAUD}</span>
            &nbsp;— we’ll coordinate purchase &amp; retirement of ACCUs.
          </p>
          <div className="flex gap-3">
            <button
              onClick={submitOrder}
              disabled={busy}
              className="flex-1 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 disabled:opacity-50"
            >
              {busy ? "Submitting…" : "Confirm Request"}
            </button>
            <button
              onClick={() => setStage("quote")}
              disabled={busy}
              className="px-4 py-2 border rounded"
            >
              Back
            </button>
          </div>
        </>
      )}

      {/* --- DONE view --- */}
      {stage === "done" && (
        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 20 20" className="w-8 h-8 text-green-600">
            <path fill="currentColor"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.54-10.54l-4.24 4.24-1.76-1.76L6 11.47l2.76 2.77 6-6-1.22-1.22z"/>
          </svg>
          <p className="text-sm text-gray-700 text-center">
            Request received. Our licensed broker partner<br/>
            will email paperwork within 1 business&nbsp;day.
          </p>
        </div>
      )}

      {/* --- INFO link & modal --- */}
      <div className="mt-4">
        <button
          onClick={()=>setShowInfo(true)}
          className="text-xs text-purple-700 underline"
        >
          How does this work?
        </button>
      </div>

      {showInfo && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl max-w-sm text-sm space-y-3">
            <h4 className="font-semibold">About Grey-Fleet Offsets</h4>
            <p>
              We purchase Australian Carbon Credit Units (ACCUs) equal to your
              Grey-Fleet Scope 2 emissions and retire them on your behalf.
              Price shown is the current spot market rate plus a 10 % service fee.
            </p>
            <p className="text-xs text-gray-500">
              millarX acts as referrer only. The trade is executed by
              <i> CarbonBroker Pty Ltd</i> (AFS Licence #####). No financial
              product advice is provided.
            </p>
            <button
              onClick={()=>setShowInfo(false)}
              className="px-3 py-1 bg-purple-700 text-white rounded float-right"
            >Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* step indicator component */
const Stepper = ({ stage }) => {
  const stepClass = (idx) =>
    "flex-1 h-2 rounded " +
    (idx <= ["quote","confirm","done"].indexOf(stage)
      ? "bg-purple-700" : "bg-gray-300");
  return (
    <div className="flex gap-1 mb-4">
      <div className={stepClass(0)} />
      <div className={stepClass(1)} />
      <div className={stepClass(2)} />
    </div>
  );
};
