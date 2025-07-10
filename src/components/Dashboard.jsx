import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const getCompanyIdFromUrl = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("company") || "bens";
    }
    return "bens";
  };
  
  const [companyId] = useState(getCompanyIdFromUrl());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("emissions");
  const [showCreditsPurchase, setShowCreditsPurchase] = useState(false);
  const [creditsPurchaseAmount, setCreditsPurchaseAmount] = useState('');
  const [carbonPurchases, setCarbonPurchases] = useState([]);
  const [evTarget, setEvTarget] = useState(50); // Default 50% target
  const [showTargetModal, setShowTargetModal] = useState(false);

  // CSV Download Functions
  const downloadCSV = (data, filename) => {
    const csvContent = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    ).join('\n');
    
    const headers = Object.keys(data[0]).join(',');
    const fullCSV = headers + '\n' + csvContent;
    
    const blob = new Blob([fullCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Fetch data from Supabase
  useEffect(() => {
    const fetchFleetData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch vehicle submissions
        const { data: submissionsData, error: submissionsError } = await supabase
          .from("submissions")
          .select("*")
          .eq("companyId", companyId)
          .order("created_at", { ascending: false });

        if (submissionsError) {
          throw submissionsError;
        }

        setRows(submissionsData || []);

        // Fetch carbon purchases
        const { data: purchasesData, error: purchasesError } = await supabase
          .from("carbon_purchases")
          .select("*")
          .eq("companyId", companyId)
          .order("created_at", { ascending: false })
          .limit(10);

        if (purchasesError) {
          console.warn("Could not fetch carbon purchases:", purchasesError);
        } else {
          setCarbonPurchases(purchasesData || []);
        }

      } catch (err) {
        console.error("Error fetching fleet data:", err);
        setError(err.message || "Failed to load fleet data");
      } finally {
        setLoading(false);
      }
    };

    fetchFleetData();
  }, [companyId]);

  // Constants for emissions calculations
  const EF = { Petrol: 2.32, Diesel: 2.66, Hybrid: 2.10, EV: 0.79 };
  const ACCU_PRICE = 35;
  const COMMISSION_RATE = 0.10;
  const PAYROLL_RATE = 0.05;
  const SG_RATE = 0.115;
  const MTR = 0.37;

  // Transform data
  const fleet = rows.map((r) => {
    const km = r.kmPerYear;
    const eff = r.fuelEfficiency;
    const fac = EF[r.fuelType] ?? 0;

    const totalKg = (km / 100) * eff * fac;
    const scope2 = totalKg * (r.businessUse / 100);
    const scope3 = totalKg - scope2;

    const baseline = r.fuelType === "EV" ? km * 0.174 : 0;
    const credit = Math.max(baseline - totalKg, 0) / 1000 * ACCU_PRICE;
    const lease = r.preTaxDeduction || 0;

    return {
      ...r,
      isNovated: !!r.hasNovated,
      totalKg,
      scope2,
      scope3,
      credit,
      payrollSave: lease * PAYROLL_RATE,
      sgSave: lease * SG_RATE,
      taxSave: ["EV", "Hybrid"].includes(r.fuelType) ? lease * MTR : 0,
      month: new Date(r.created_at).toISOString().slice(0, 7)
    };
  });

  // Calculations
  const novatedCount = fleet.filter(f => f.isNovated).length;
  const scope2Total = fleet.reduce((s, v) => s + v.scope2, 0) / 1000;
  const liability = scope2Total * ACCU_PRICE;
  const payrollTotal = fleet.reduce((s, v) => s + v.payrollSave, 0);
  const sgTotal = fleet.reduce((s, v) => s + v.sgSave, 0);
  const evCreditSave = fleet.reduce((s, v) => s + v.credit, 0);
  const evTaxSave = fleet.reduce((s, v) => s + v.taxSave, 0);

  // EV adoption metrics
  const evCount = fleet.filter(f => ["EV", "Hybrid"].includes(f.fuelType)).length;
  const percentEV = fleet.length ? (evCount / fleet.length * 100) : 0;
  const gapCars = Math.max(Math.ceil(evTarget / 100 * fleet.length - evCount), 0);
  const gapPercentage = Math.max(evTarget - percentEV, 0);

  // Get actionable recommendations based on current adoption level
  const getEvRecommendations = () => {
    const recommendations = [];
    
    if (percentEV < 10) {
      recommendations.push({
        priority: "high",
        action: "Book an EV Education Webinar",
        description: "Schedule a millarX webinar to educate staff about EV benefits and novated leasing",
        contact: "Contact Ben at millarX",
        icon: "🎓",
        estimatedImpact: "5-15% adoption increase"
      });
      recommendations.push({
        priority: "high", 
        action: "Organize EV Test Drive Day",
        description: "Arrange for employees to test drive various EV models on-site",
        contact: "Contact Ben to organize",
        icon: "🚗",
        estimatedImpact: "10-20% adoption increase"
      });
    }
    
    if (percentEV < 25) {
      recommendations.push({
        priority: "medium",
        action: "Enhanced Salary Packaging Education",
        description: "Run targeted sessions on tax benefits and salary packaging for EVs",
        contact: "Book through millarX",
        icon: "💰",
        estimatedImpact: "5-10% adoption increase"
      });
      recommendations.push({
        priority: "medium",
        action: "Install Workplace EV Charging",
        description: "Add EV charging stations to encourage adoption",
        contact: "Contact Ben for charging solutions",
        icon: "⚡",
        estimatedImpact: "8-15% adoption increase"
      });
    }
    
    if (percentEV < evTarget) {
      recommendations.push({
        priority: "low",
        action: "EV Champion Program",
        description: "Identify EV advocates to share experiences with colleagues",
        contact: "millarX can help setup program",
        icon: "🏆",
        estimatedImpact: "3-8% adoption increase"
      });
      recommendations.push({
        priority: "low",
        action: "Fleet Policy Review",
        description: "Update company car policy to prioritize or mandate EVs",
        contact: "Policy templates available from millarX",
        icon: "📋",
        estimatedImpact: "10-25% adoption increase"
      });
    }

    if (percentEV >= evTarget) {
      recommendations.push({
        priority: "success",
        action: "Maintain Momentum",
        description: "Continue current initiatives and consider increasing targets",
        contact: "Discuss expansion with millarX",
        icon: "🎉",
        estimatedImpact: "Target achieved!"
      });
    }
    
    return recommendations;
  };

  const evRecommendations = getEvRecommendations();

  // Fleet summary by fuel type
  const fleetSummary = ["EV", "Hybrid", "Petrol", "Diesel"]
    .map(fuel => {
      const vehicles = fleet.filter(f => f.fuelType === fuel);
      if (!vehicles.length) return null;
      
      const scope2Sum = vehicles.reduce((s, v) => s + v.scope2, 0) / 1000;
      const scope3Sum = vehicles.reduce((s, v) => s + v.scope3, 0) / 1000;
      const totalSum = vehicles.reduce((s, v) => s + v.totalKg, 0) / 1000;
      
      return {
        fuel,
        count: vehicles.length,
        scope2: scope2Sum,
        scope3: scope3Sum,
        total: totalSum,
        color: fuel === "EV" ? "#10b981" : fuel === "Hybrid" ? "#06b6d4" : fuel === "Petrol" ? "#f59e0b" : "#ef4444"
      };
    })
    .filter(Boolean);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-AU').format(num);
  };

  const downloadFleetData = () => {
    const csvData = fleet.map(vehicle => ({
      employeeId: vehicle.employeeId,
      vehicleType: vehicle.vehicleType,
      fuelType: vehicle.fuelType,
      kmPerYear: vehicle.kmPerYear,
      fuelEfficiency: vehicle.fuelEfficiency,
      businessUse: vehicle.businessUse,
      scope2Emissions: (vehicle.scope2 / 1000).toFixed(2),
      scope3Emissions: (vehicle.scope3 / 1000).toFixed(2),
      totalEmissions: (vehicle.totalKg / 1000).toFixed(2),
      isNovated: vehicle.isNovated,
      preTaxDeduction: vehicle.preTaxDeduction,
      created_at: vehicle.created_at
    }));
    
    downloadCSV(csvData, `${companyId}_fleet_emissions_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadCarbonPurchases = () => {
    if (carbonPurchases.length === 0) {
      alert('No carbon purchases to download');
      return;
    }
    
    const csvData = carbonPurchases.map(purchase => ({
      purchaseDate: new Date(purchase.created_at).toLocaleDateString(),
      tonnesPurchased: purchase.tonnesPurchased,
      baseCost: purchase.baseCost,
      commission: purchase.commission,
      totalCost: purchase.totalCost,
      status: purchase.status,
      purchaseId: purchase.id
    }));
    
    downloadCSV(csvData, `${companyId}_carbon_purchases_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadComplianceReport = () => {
    const totalEmissions = fleet.reduce((sum, v) => sum + v.totalKg, 0) / 1000;
    const totalScope2 = fleet.reduce((sum, v) => sum + v.scope2, 0) / 1000;
    const totalScope3 = fleet.reduce((sum, v) => sum + v.scope3, 0) / 1000;
    const totalPurchases = carbonPurchases.reduce((sum, p) => sum + parseFloat(p.tonnesPurchased), 0);
    const netEmissions = totalScope2 - totalPurchases;
    
    const csvData = [{
      reportDate: new Date().toLocaleDateString(),
      companyId: companyId,
      totalVehicles: fleet.length,
      totalEmissionsTonnes: totalEmissions.toFixed(2),
      scope2EmissionsTonnes: totalScope2.toFixed(2),
      scope3EmissionsTonnes: totalScope3.toFixed(2),
      carbonCreditsPurchased: totalPurchases.toFixed(2),
      netScope2Emissions: netEmissions.toFixed(2),
      evAdoptionPercentage: percentEV.toFixed(1),
      carbonLiabilityAUD: liability.toFixed(2),
      reportingPeriod: `${new Date().getFullYear()}`
    }];
    
    downloadCSV(csvData, `${companyId}_compliance_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleBuyCredits = async () => {
    if (creditsPurchaseAmount && parseFloat(creditsPurchaseAmount) > 0) {
      const amount = parseFloat(creditsPurchaseAmount);
      const baseCost = amount * ACCU_PRICE;
      const commission = baseCost * COMMISSION_RATE;
      const totalCost = baseCost + commission;
      
      try {
        const { data, error } = await supabase
          .from('carbon_purchases')
          .insert({
            companyId: companyId,
            tonnesPurchased: amount,
            baseCost: baseCost,
            commission: commission,
            totalCost: totalCost,
            status: 'pending'
          })
          .select();

        if (error) throw error;

        alert(`Carbon Credit Purchase Initiated\n\nAmount: ${amount} tonnes CO₂-e\nBase Cost: ${formatCurrency(baseCost)}\nCommission (10%): ${formatCurrency(commission)}\nTotal Cost: ${formatCurrency(totalCost)}\n\nPurchase ID: ${data[0].id}`);
        
        // Refresh carbon purchases list
        const { data: purchasesData } = await supabase
          .from("carbon_purchases")
          .select("*")
          .eq("companyId", companyId)
          .order("created_at", { ascending: false })
          .limit(10);
        
        setCarbonPurchases(purchasesData || []);
        
      } catch (error) {
        console.error('Purchase error:', error);
        alert(`Error processing purchase: ${error.message}`);
      }
      
      setShowCreditsPurchase(false);
      setCreditsPurchaseAmount('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-700 font-medium">Loading {companyId.toUpperCase()} fleet data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Data</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-100">
        <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center space-x-4">
              <img 
                src="https://static.wixstatic.com/media/9c690e_1417a61dc4164e59b7fc0a0ad49b7c82~mv2.png" 
                alt="millarX Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {companyId.toUpperCase()} Fleet Dashboard
                </h1>
                <p className="text-sm text-slate-600">No vehicle data available</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex items-center justify-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Vehicle Data</h3>
            <p className="text-slate-600 mb-4">
              No vehicle submissions found for company <strong>{companyId}</strong>. 
              Employees need to submit their vehicle information first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-100">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(147, 51, 234, 0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://static.wixstatic.com/media/9c690e_1417a61dc4164e59b7fc0a0ad49b7c82~mv2.png" 
                alt="millarX Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {companyId.toUpperCase()} Fleet Dashboard
                </h1>
                <p className="text-sm text-slate-600">Real-time emissions & fleet analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTargetModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>🎯</span>
                <span>Set EV Target</span>
              </button>
              <button
                onClick={() => setShowCreditsPurchase(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <span>🌱</span>
                <span>Buy Carbon Credits</span>
              </button>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="emissions">Emissions View</option>
                <option value="financial">Financial View</option>
                <option value="compliance">Compliance View</option>
                <option value="downloads">Downloads</option>
                <option value="executive">Executive Summary</option>
              </select>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">Company: {companyId.toUpperCase()}</p>
                <p className="text-xs text-slate-500">Last Updated: {new Date().toLocaleString()}</p>
                <p className="text-xs text-slate-500">{formatNumber(fleet.length)} vehicles tracked</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* EV Target Setting Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Set EV Adoption Target</h3>
              <button
                onClick={() => setShowTargetModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-600">📊</span>
                  <span className="font-medium text-blue-800">Current Status</span>
                </div>
                <div className="text-2xl font-bold text-blue-800">{percentEV.toFixed(1)}%</div>
                <div className="text-sm text-blue-600">{evCount} of {fleet.length} vehicles are EV/Hybrid</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target EV Adoption Percentage
                </label>
                <input
                  type="number"
                  value={evTarget}
                  onChange={(e) => setEvTarget(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                  step="5"
                />
                <p className="text-xs text-slate-500 mt-1">Recommended: 30-50% for most companies</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800 mb-2">Impact of Reaching {evTarget}% Target:</div>
                <div className="space-y-1 text-sm text-green-700">
                  <div>• {Math.ceil(evTarget / 100 * fleet.length)} total EV/Hybrid vehicles needed</div>
                  <div>• {gapCars} additional vehicles to convert</div>
                  <div>• Estimated annual savings: {formatCurrency(gapCars * 2000)} in tax benefits</div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTargetModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowTargetModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Set Target
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carbon Credits Purchase Modal */}
      {showCreditsPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Purchase Carbon Credits</h3>
              <button
                onClick={() => setShowCreditsPurchase(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-orange-600">⚠️</span>
                  <span className="font-medium text-orange-800">Current Liability</span>
                </div>
                <div className="text-2xl font-bold text-orange-800">{scope2Total.toFixed(2)} tonnes CO₂-e</div>
                <div className="text-sm text-orange-600">Estimated cost: {formatCurrency(liability)}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Carbon Credits to Purchase (tonnes CO₂-e)
                </label>
                <input
                  type="number"
                  value={creditsPurchaseAmount}
                  onChange={(e) => setCreditsPurchaseAmount(e.target.value)}
                  placeholder={scope2Total.toFixed(2)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
              </div>
              
              {creditsPurchaseAmount && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-700">Base Cost:</span>
                      <span className="font-medium text-green-800">
                        {formatCurrency(parseFloat(creditsPurchaseAmount) * ACCU_PRICE)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-700">Commission (10%):</span>
                      <span className="font-medium text-green-800">
                        {formatCurrency(parseFloat(creditsPurchaseAmount) * ACCU_PRICE * COMMISSION_RATE)}
                      </span>
                    </div>
                    <div className="border-t border-green-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-green-800 font-medium">Total Cost:</span>
                        <span className="text-xl font-bold text-green-800">
                          {formatCurrency(parseFloat(creditsPurchaseAmount) * ACCU_PRICE * (1 + COMMISSION_RATE))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-green-600 mt-2">
                    @ {formatCurrency(ACCU_PRICE)} per tonne CO₂-e + 10% commission
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreditsPurchase(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyCredits}
                  disabled={!creditsPurchaseAmount || parseFloat(creditsPurchaseAmount) <= 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Purchase Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Downloads View */}
        {selectedMetric === "downloads" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Download Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Fleet Emissions Data</h4>
                    <p className="text-sm text-slate-600">Detailed vehicle emissions for accounting</p>
                  </div>
                </div>
                <button
                  onClick={downloadFleetData}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download Fleet CSV
                </button>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🌱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Carbon Purchases</h4>
                    <p className="text-sm text-slate-600">Credit purchase history</p>
                  </div>
                </div>
                <button
                  onClick={downloadCarbonPurchases}
                  disabled={carbonPurchases.length === 0}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  Download Purchases CSV
                </button>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📋</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Compliance Report</h4>
                    <p className="text-sm text-slate-600">Summary for regulatory reporting</p>
                  </div>
                </div>
                <button
                  onClick={downloadComplianceReport}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Download Compliance CSV
                </button>
              </div>
            </div>
            
            <div className="mt-8 bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-2">📁 File Formats & Usage</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-slate-700">Fleet Emissions CSV</p>
                  <p className="text-slate-600">Perfect for Excel, accounting software, or Scope 1 reporting systems</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Carbon Purchases CSV</p>
                  <p className="text-slate-600">Track carbon credit purchases for financial reconciliation</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Compliance Report CSV</p>
                  <p className="text-slate-600">High-level summary for regulatory submissions and board reporting</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Executive Summary View */}
        {selectedMetric === "executive" && (
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Executive Summary</h3>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-800">{companyId.toUpperCase()}</p>
                  <p className="text-sm text-slate-600">Fleet Sustainability Report</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-3">🎯 Key Achievements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-green-800">EV Adoption Rate</span>
                        <span className="font-bold text-green-800">{percentEV.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-800">Annual Cost Savings</span>
                        <span className="font-bold text-blue-800">{formatCurrency(payrollTotal + sgTotal + evCreditSave)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-purple-800">Novated Lease Adoption</span>
                        <span className="font-bold text-purple-800">{((novatedCount / fleet.length) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-3">📊 Fleet Composition</h4>
                    <div className="space-y-2">
                      {fleetSummary.map(fuel => (
                        <div key={fuel.fuel} className="flex items-center justify-between p-2 border-l-4" style={{borderColor: fuel.color}}>
                          <span className="text-slate-700">{fuel.fuel} Vehicles</span>
                          <span className="font-medium">{fuel.count} ({((fuel.count / fleet.length) * 100).toFixed(1)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-3">🌱 Environmental Impact</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-800">{scope2Total.toFixed(1)}</div>
                          <div className="text-sm text-orange-600">tonnes CO₂-e (Scope 2)</div>
                          <div className="text-xs text-orange-600 mt-1">Annual carbon liability</div>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-800">{evCount}</div>
                          <div className="text-sm text-green-600">Zero Emission Vehicles</div>
                          <div className="text-xs text-green-600 mt-1">Contributing to sustainability goals</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-3">💰 Financial Benefits</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <div className="text-lg font-bold text-slate-800">{formatCurrency(payrollTotal)}</div>
                        <div className="text-xs text-slate-600">Payroll Tax Savings</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <div className="text-lg font-bold text-slate-800">{formatCurrency(sgTotal)}</div>
                        <div className="text-xs text-slate-600">Super Savings</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <div className="text-lg font-bold text-slate-800">{formatCurrency(evTaxSave)}</div>
                        <div className="text-xs text-slate-600">Employee Tax Benefits</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <div className="text-lg font-bold text-slate-800">{formatCurrency(evCreditSave)}</div>
                        <div className="text-xs text-slate-600">Carbon Credits</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">🏆 Success Stories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg">
                    <h5 className="font-semibold text-slate-800 mb-2">Employee Benefits Program</h5>
                    <p className="text-sm text-slate-600">
                      {novatedCount} employees are saving an average of {formatCurrency((evTaxSave + payrollTotal + sgTotal) / Math.max(novatedCount, 1))} 
                      annually through our novated lease program, while driving more sustainable vehicles.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <h5 className="font-semibold text-slate-800 mb-2">Sustainability Progress</h5>
                    <p className="text-sm text-slate-600">
                      With {percentEV.toFixed(1)}% EV adoption, we're {percentEV > 50 ? 'exceeding' : 'progressing toward'} our 50% 
                      sustainable vehicle target, demonstrating our commitment to environmental responsibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Dashboard Views */}
        {selectedMetric !== "downloads" && selectedMetric !== "executive" && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Fleet"
                value={formatNumber(fleet.length)}
                subtitle="Registered vehicles"
                icon="🚗"
                color="blue"
              />
              <MetricCard
                title="Novated Leases"
                value={formatNumber(novatedCount)}
                subtitle={`${((novatedCount / fleet.length) * 100).toFixed(1)}% of fleet`}
                icon="📋"
                color="purple"
              />
              <MetricCard
                title="EV Adoption"
                value={`${percentEV.toFixed(1)}%`}
                subtitle={`${evCount} electric vehicles`}
                icon="⚡"
                color="green"
              />
              <MetricCard
                title={selectedMetric === "financial" ? "Annual Savings" : "Carbon Liability"}
                value={selectedMetric === "financial" ? formatCurrency(payrollTotal + sgTotal + evCreditSave) : formatCurrency(liability)}
                subtitle={selectedMetric === "financial" ? "Combined benefits" : `${scope2Total.toFixed(1)} tonnes CO₂-e`}
                icon={selectedMetric === "financial" ? "💰" : "🌱"}
                color="orange"
              />
            </div>

            {/* EV Adoption Progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">EV Adoption Progress</h3>
                <button
                  onClick={() => setShowTargetModal(true)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Adjust Target ({evTarget}%)
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex justify-center">
                  <div className="relative">
                    <ResponsiveContainer width={250} height={250}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "EV/Hybrid", value: percentEV },
                            { name: "Traditional", value: 100 - percentEV }
                          ]}
                          startAngle={90}
                          endAngle={-270}
                          innerRadius={80}
                          outerRadius={110}
                          dataKey="value"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-800">{percentEV.toFixed(1)}%</div>
                        <div className="text-sm text-slate-600">EV Adoption</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>Progress to {evTarget}% Target</span>
                      <span>{percentEV.toFixed(1)}% / {evTarget}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((percentEV / evTarget) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {percentEV >= evTarget 
                        ? "🎉 Target achieved!" 
                        : `${gapPercentage.toFixed(1)}% gap to target`}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="text-lg font-bold text-green-700">{evCount}</div>
                      <div className="text-sm text-green-600">Current EV/Hybrid</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-lg font-bold text-slate-700">{gapCars}</div>
                      <div className="text-sm text-slate-600">Needed for Target</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-sm font-medium text-purple-800 mb-2">Target Achievement Benefits</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Additional Tax Savings:</span>
                        <span className="font-medium">{formatCurrency(gapCars * 2000)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CO₂ Reduction:</span>
                        <span className="font-medium">{(gapCars * 2.5).toFixed(1)} tonnes/year</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Plan to Achieve Target */}
            {percentEV < evTarget && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Action Plan to Reach {evTarget}% Target</h3>
                  <div className="text-sm text-slate-600">
                    {gapCars} more EV adoptions needed
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {evRecommendations.map((rec, index) => (
                    <div key={index} className={`rounded-xl p-6 border-2 ${
                      rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                      rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                      rec.priority === 'success' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{rec.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-800">{rec.action}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              rec.priority === 'success' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {rec.priority === 'success' ? 'Complete' : `${rec.priority} priority`}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-slate-700">{rec.contact}</p>
                            <p className="text-xs text-green-600 font-medium">{rec.estimatedImpact}</p>
                          </div>
                          {rec.priority !== 'success' && (
                            <button className="mt-3 w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
                              Get Started
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-600">📞</span>
                    <span className="font-semibold text-slate-800">Need Help?</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Contact Ben at millarX for personalized advice on achieving your EV adoption targets. 
                    We can help with education programs, policy development, and implementation strategies.
                  </p>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Contact millarX
                  </button>
                </div>
              </div>
            )}

            {/* Success Message */}
            {percentEV >= evTarget && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Congratulations!</h3>
                  <p className="text-slate-600 mb-4">
                    You've achieved your {evTarget}% EV adoption target with {percentEV.toFixed(1)}% adoption rate.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-800">{evCount}</div>
                      <div className="text-sm text-green-600">EV/Hybrid Vehicles</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-800">{formatCurrency(evTaxSave)}</div>
                      <div className="text-sm text-blue-600">Annual Tax Savings</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-800">{(evCount * 2.5).toFixed(1)}</div>
                      <div className="text-sm text-purple-600">Tonnes CO₂ Saved/Year</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button 
                      onClick={() => setEvTarget(Math.min(100, evTarget + 10))}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Set Higher Target
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fleet Composition - Show for emissions view */}
            {selectedMetric === "emissions" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Fleet Composition</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fleetSummary}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="fuel" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <RTooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Emissions Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fleetSummary}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="fuel" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <RTooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`${value.toFixed(2)} tonnes`, '']}
                      />
                      <Legend />
                      <Bar dataKey="scope2" fill="#7c3aed" name="Scope 2" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="scope3" fill="#c4b5fd" name="Scope 3" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Carbon Credit Purchases */}
            {carbonPurchases.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Carbon Credit Purchases</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Tonnes</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Base Cost</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Commission</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Total Cost</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carbonPurchases.map((purchase, index) => (
                        <tr key={purchase.id} className={`border-b border-slate-100 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                          <td className="py-3 px-4">
                            {new Date(purchase.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">{purchase.tonnesPurchased}</td>
                          <td className="py-3 px-4">{formatCurrency(purchase.baseCost)}</td>
                          <td className="py-3 px-4">{formatCurrency(purchase.commission)}</td>
                          <td className="py-3 px-4 font-medium">{formatCurrency(purchase.totalCost)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              purchase.status === 'completed' ? 'bg-green-100 text-green-800' :
                              purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {purchase.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Component helpers
const MetricCard = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600", 
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
};