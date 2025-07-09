/*  src/components/Dashboard.jsx  */
import { useEffect, useState } from "react";
import { useLocation }         from "react-router-dom";
import dayjs                   from "dayjs";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  ResponsiveContainer
} from "recharts";
import { supabase }            from "../supabaseClient";
import BuyCreditsBanner        from "./BuyCreditsBanner";
import GreenfleetCard          from "./GreenfleetCard";
import { formatCurrency, formatNumber } from "../components/formatters";

/* ---------------- constants ---------------- */
const EF            = { Petrol: 2.32, Diesel: 2.66, Hybrid: 2.10, EV: 0.79 }; // kg CO₂-e / L or kWh
const ACCU_PRICE    = 35;   // A$ per tonne CO₂-e
const PAYROLL_RATE  = 0.05; // 5 %
const SG_RATE       = 0.11; // 11 %
const MTR           = 0.37; // employee marginal-tax rate (demo)

const PURPLE_DARK   = "#7c3aed";
const PURPLE_LIGHT  = "#c4b5fd";

/* ---------------- component ---------------- */
export default function Dashboard() {
  const companyId = new URLSearchParams(useLocation().search).get("company");

  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------- fetch data from Supabase -------- */
  useEffect(() => {
    if (!companyId) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("companyId", companyId);
      if (error) console.error(error);
      setRows(data ?? []);
      setLoading(false);
    })();
  }, [companyId]);

  /* -------- transform each record -------- */
  const fleet = rows.map((r) => {
    const km  = r.kmPerYear;
    const eff = r.fuelEfficiency;
    const fac = EF[r.fuelType] ?? 0;

    const totalKg = (km / 100) * eff * fac;        // kg CO₂-e
    const scope2  = totalKg * (r.businessUse / 100);
    const scope3  = totalKg - scope2;

    /* EV baseline credit */
    const baseline = r.fuelType === "EV" ? km * 0.174 : 0; // kg per km petrol
    const credit   = Math.max(baseline - totalKg, 0) / 1000 * ACCU_PRICE; // $

    const lease    = r.preTaxDeduction || 0;

    return {
      ...r,
      isNovated   : !!r.hasNovated,          // <-- use your Boolean column
      totalKg,
      scope2,
      scope3,
      credit,
      payrollSave : lease * PAYROLL_RATE,
      sgSave      : lease * SG_RATE,
      taxSave     : ["EV", "Hybrid"].includes(r.fuelType) ? lease * MTR : 0,
      month       : dayjs(r.created_at || Date.now()).format("YYYY-MM")
    };
  });

  /* -------- aggregates -------- */
  const novatedCount = fleet.filter(f => f.isNovated).length;      // ✅ updated
  const personal     = fleet.filter(f => f.businessUse === 0).length;
  const grey         = fleet.filter(f => f.businessUse  > 0).length;

  const scope2t   = fleet.reduce((s,v) => s + v.scope2, 0) / 1000;
  const liability = scope2t * ACCU_PRICE;

  /* Company-benefit metrics still use the whole fleet (demo logic) */
  const payrollTot   = fleet.reduce((s,v) => s + v.payrollSave, 0);
  const sgTot        = fleet.reduce((s,v) => s + v.sgSave,      0);
  const evCreditSave = fleet.reduce((s,v) => s + v.credit,      0);
  const evTaxSave    = fleet.reduce((s,v) => s + v.taxSave,     0);

  /* -------- summaries for charts -------- */
  const summary = ["EV","Hybrid","Petrol","Diesel"]
    .map(fuel => {
      const set = fleet.filter(f => f.fuelType === fuel);
      if (!set.length) return null;
      const s2 = set.reduce((s,v)=>s+v.scope2,0)/1000;
      const s3 = set.reduce((s,v)=>s+v.scope3,0)/1000;
      const tt = set.reduce((s,v)=>s+v.totalKg,0)/1000;
      return { fuel, count:set.length, s2, s3, tot:tt };
    })
    .filter(Boolean);

  /* EV-share gauge */
  const evCount   = fleet.filter(f => ["EV","Hybrid"].includes(f.fuelType)).length;
  const percentEV = evCount ? evCount / fleet.length * 100 : 0;
  const targetPct = 25;
  const gapCars   = Math.max(Math.ceil(targetPct/100*fleet.length - evCount),0);

  /* -------- guards -------- */
  if (!companyId)
    return <p className="p-6 text-red-600">Add <code>?company=ID</code>.</p>;
  if (loading)   return <p className="p-6">Loading…</p>;
  if (!fleet.length)
    return <p className="p-6">No submissions yet for <b>{companyId}</b>.</p>;

  /* ---------------- render ---------------- */
  return (
    <div className="min-h-screen bg-purple-50 p-6 space-y-8">
      <h1 className="text-2xl font-bold text-purple-800">
        {companyId.toUpperCase()} • Emissions Dashboard
      </h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Novated Cars"        value={formatNumber(novatedCount)} />
        <Card title="Grey Fleet"          value={formatNumber(grey)} />
        <Card title="Grey-Fleet Liability" value={formatCurrency(liability)} />
        <Card title="EV Credit Saving/yr" value={formatCurrency(evCreditSave)} />
      </div>

      {/* banners */}
      <BuyCreditsBanner companyId={companyId} liabilityTonnes={scope2t} />
      <GreenfleetCard />

      {/* Company benefits */}
      <HoverBox title="Company Benefits">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Payroll-Tax Saving" value={`${formatCurrency(payrollTot)}/yr`} />
          <Card title="Super (SG) Saving"  value={`${formatCurrency(sgTot)}/yr`} />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Savings assume {(PAYROLL_RATE*100).toFixed(1)} % payroll-tax &
          {(SG_RATE*100).toFixed(0)} % SG.
        </p>
      </HoverBox>

      {/* Fuel emission pies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summary.map(d => (
          <HoverBox key={d.fuel} title={`${d.fuel} Emissions`}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={[{name:"Scope 2",value:d.s2},{name:"Scope 3",value:d.s3}]}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({name,value}) => `${name}: ${value.toFixed(1)} t`}
                >
                  <Cell fill={PURPLE_DARK} /><Cell fill={PURPLE_LIGHT} />
                </Pie>
                <RTooltip formatter={v => `${v.toFixed(2)} t`} />
              </PieChart>
            </ResponsiveContainer>
          </HoverBox>
        ))}
      </div>

      {/* EV progress */}
      <HoverBox title="EV Adoption Progress">
        <div className="flex flex-col items-center">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={[
                  {name:"Progress",  value:percentEV},
                  {name:"Remaining", value:100-percentEV}
                ]}
                startAngle={90}
                endAngle={-270}
                innerRadius={70}
                outerRadius={90}
                dataKey="value"
              >
                <Cell fill={PURPLE_DARK} /><Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <p className="mt-1 text-lg font-bold">
            {percentEV.toFixed(1)}%
            <span className="text-sm text-gray-600"> EV / Hybrid</span>
          </p>
          {gapCars > 0 && (
            <p className="text-xs text-gray-600">
              {gapCars} more vehicles needed to reach {targetPct}% target
            </p>
          )}

          <p className="text-xs text-gray-700 text-center max-w-xs mt-2">
            EV salary-sacrifice saves employees&nbsp;
            <b>{formatCurrency(evTaxSave)}/yr</b> and the company&nbsp;
            <b>{formatCurrency(evCreditSave)}/yr</b> in carbon-credit costs.
          </p>
        </div>
      </HoverBox>

      {/* Fleet summary table */}
      <HoverBox title="Fleet Summary by Fuel">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                {["Fuel","Vehicles","Scope 2 (t)","Scope 3 (t)","Total (t)"]
                  .map(h => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {summary.map(r => (
                <tr key={r.fuel} className="border-b last:border-0">
                  <Td>{r.fuel}</Td>
                  <Td>{formatNumber(r.count)}</Td>
                  <Td>{r.s2.toFixed(2)}</Td>
                  <Td>{r.s3.toFixed(2)}</Td>
                  <Td>{r.tot.toFixed(2)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HoverBox>
    </div>
  );
}

/* -------- tiny atoms -------- */
const Card = ({title, value}) => (
  <div className="bg-white p-4 rounded-xl shadow text-center hover:shadow-lg transition">
    <div className="text-xs text-gray-500">{title}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);
const HoverBox = ({title, children}) => (
  <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
    <div className="text-sm font-semibold mb-2">{title}</div>
    {children}
  </div>
);
const Th = p => <th className="text-left px-2 py-1">{p.children}</th>;
const Td = p => <td className="px-2 py-1">{p.children}</td>;
