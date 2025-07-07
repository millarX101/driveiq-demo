//  BuyCreditsBanner.jsx  (replaces old file)
import { useState } from "react";
import { supabase } from "../supabaseClient";

/* Pricing constants (adjust anytime) */
const ACCU_SPOT   = 35;    //  A$ per tonne CO₂-e    (current ACCU spot)
const SERVICE_FEE = 0.10;  //  10 % margin

export default function BuyCreditsBanner({ companyId, liabilityTonnes }) {
  const [stage, setStage] = useState("quote");  // quote → confirm → done
  const [busy,  setBusy]  = useState(false);

  /* if no Grey-Fleet Scope 2, hide banner */
  if (!liabilityTonnes || liabilityTonnes === 0) return null;

  /* final sell rate & cost */
  const sellRate = ACCU_SPOT * (1 + SERVICE_FEE);
  const costAUD  = (liabilityTonnes * sellRate).toFixed(0);

  /* create order row in Supabase */
  const placeOrder = async () => {
    setBusy(true);
    const { error } = await supabase.from("orders").insert([{
      companyId,
      tonnes:       liabilityTonnes,
      pricePerTonne: sellRate,
      totalCost:    costAUD,
      status:       "requested"
    }]);
    setBusy(false);
    if (error) return alert(error.message);
    setStage("done");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center space-y-3">
      <h3 className="text-lg font-semibold">Offset Grey-Fleet Carbon</h3>

      {stage === "quote" && (
        <>
          <p className="text-sm">
            Business-use emissions:&nbsp;
            <b>{liabilityTonnes.toFixed(2)} t CO₂-e</b>
            <br />
            Offset at&nbsp;<b>A${sellRate.toFixed(2)}/t</b>
          </p>
          <button
            onClick={()=>setStage("confirm")}
            className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800">
            Get Quote
          </button>
        </>
      )}

      {stage === "confirm" && (
        <>
          <p className="text-sm">
            Total cost&nbsp;
            <span className="text-xl font-bold">A${costAUD}</span><br />
            We purchase &amp; retire ACCUs on your behalf.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={placeOrder}
              disabled={busy}
              className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 disabled:opacity-50">
              {busy ? "Submitting…" : "Confirm Request"}
            </button>
            <button
              onClick={()=>setStage("quote")}
              disabled={busy}
              className="px-4 py-2 border rounded">
              Back
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Price = spot {ACCU_SPOT}/t + {SERVICE_FEE*100}% service fee
          </p>
        </>
      )}

      {stage === "done" && (
        <p className="text-sm">
          ✅ Request received. Our licensed broker partner will email paperwork
          within 1&nbsp;business day.
        </p>
      )}

      {/* disclaimer */}
      <p className="text-xs text-gray-500">
        millarX acts as referrer only. Trade executed by CarbonBroker (AFSL #####).
      </p>
    </div>
  );
}
