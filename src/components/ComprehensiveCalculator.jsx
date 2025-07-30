import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Calculator, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Info,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { saveQuote } from '../utils/supabase';

const ComprehensiveCalculator = ({ onQuoteSaved }) => {
  // Form state
  const [formData, setFormData] = useState({
    // Vehicle Details
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    vehiclePrice: '',
    fuelType: 'petrol',
    engineSize: '',
    bodyStyle: 'sedan',
    
    // Customer Details
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    employer: '',
    employerCode: '',
    state: 'VIC',
    
    // Financial Details
    annualSalary: '',
    payCycle: 'Monthly',
    termYears: 3,
    annualKms: 15000,
    businessUsePercent: 20,
    fbtMethod: 'statutory',
    
    // Running Costs (will be calculated)
    insurance: '',
    fuelCost: '',
    maintenanceCost: '',
    tyreCost: '',
    registration: '',
    
    // Finance Details
    baseRate: 5.99,
    establishmentFee: 495,
    balloonPayment: ''
  });

  const [calculations, setCalculations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  // Australian states
  const states = [
    { value: 'VIC', label: 'Victoria' },
    { value: 'NSW', label: 'New South Wales' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' }
  ];

  // Tax brackets for 2024-25
  const getTaxRate = (income) => {
    if (income <= 18200) return 0;
    if (income <= 45000) return 0.19;
    if (income <= 120000) return 0.325;
    if (income <= 180000) return 0.37;
    return 0.45;
  };

  // Calculate stamp duty based on state and vehicle price
  const calculateStampDuty = (price, state) => {
    const stateRates = {
      'VIC': 0.055, // 5.5%
      'NSW': 0.03, // 3%
      'QLD': 0.035, // 3.5%
      'WA': 0.0275, // 2.75%
      'SA': 0.03, // 3%
      'TAS': 0.04, // 4%
      'ACT': 0.03, // 3%
      'NT': 0.055 // 5.5%
    };
    return price * (stateRates[state] || 0.03);
  };

  // Calculate registration costs
  const calculateRegistration = (state, vehiclePrice) => {
    const baseCosts = {
      'VIC': 850,
      'NSW': 750,
      'QLD': 680,
      'WA': 720,
      'SA': 650,
      'TAS': 600,
      'ACT': 700,
      'NT': 650
    };
    return baseCosts[state] || 700;
  };

  // Estimate running costs based on vehicle details
  const estimateRunningCosts = (vehiclePrice, fuelType, annualKms, engineSize) => {
    const baseInsurance = Math.max(1200, vehiclePrice * 0.02); // 2% of vehicle value, minimum $1200
    
    // Fuel costs per 100km
    const fuelRates = {
      'petrol': 12.5,
      'diesel': 11.0,
      'hybrid': 6.5,
      'electric': 3.5
    };
    
    const fuelCostPer100km = fuelRates[fuelType] || 12.5;
    const annualFuelCost = (annualKms / 100) * fuelCostPer100km;
    
    // Maintenance based on vehicle price and age
    const maintenanceCost = Math.max(800, vehiclePrice * 0.015); // 1.5% of vehicle value, minimum $800
    
    // Tyre costs
    const tyreCost = Math.max(400, (engineSize || 2.0) * 200); // Based on engine size
    
    return {
      insurance: Math.round(baseInsurance),
      fuel: Math.round(annualFuelCost),
      maintenance: Math.round(maintenanceCost),
      tyres: Math.round(tyreCost)
    };
  };

  // Main calculation function
  const calculateLease = () => {
    setLoading(true);
    
    try {
      const vehiclePrice = parseFloat(formData.vehiclePrice) || 0;
      const annualSalary = parseFloat(formData.annualSalary) || 0;
      const termYears = parseInt(formData.termYears) || 3;
      const annualKms = parseInt(formData.annualKms) || 15000;
      const businessUse = parseInt(formData.businessUsePercent) || 20;
      const baseRate = parseFloat(formData.baseRate) || 5.99;
      const establishmentFee = parseFloat(formData.establishmentFee) || 495;
      
      // Calculate stamp duty and registration
      const stampDuty = calculateStampDuty(vehiclePrice, formData.state);
      const registration = calculateRegistration(formData.state, vehiclePrice);
      
      // Estimate running costs if not provided
      const runningCosts = estimateRunningCosts(
        vehiclePrice, 
        formData.fuelType, 
        annualKms, 
        parseFloat(formData.engineSize)
      );
      
      // Use provided running costs or estimates
      const insurance = parseFloat(formData.insurance) || runningCosts.insurance;
      const fuelCost = parseFloat(formData.fuelCost) || runningCosts.fuel;
      const maintenanceCost = parseFloat(formData.maintenanceCost) || runningCosts.maintenance;
      const tyreCost = parseFloat(formData.tyreCost) || runningCosts.tyres;
      
      const totalRunningCosts = insurance + fuelCost + maintenanceCost + tyreCost + registration;
      
      // Calculate balloon payment (residual value)
      const residualRates = {
        1: 0.65, 2: 0.56, 3: 0.46, 4: 0.37, 5: 0.28
      };
      const residualRate = residualRates[termYears] || 0.46;
      const balloonPayment = parseFloat(formData.balloonPayment) || (vehiclePrice * residualRate);
      
      // Calculate NAF (Net Amount Financed)
      const naf = vehiclePrice + stampDuty + establishmentFee - balloonPayment;
      
      // Calculate monthly finance payment
      const monthlyRate = (baseRate / 100) / 12;
      const termMonths = termYears * 12;
      const monthlyFinancePayment = (naf * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                                   (Math.pow(1 + monthlyRate, termMonths) - 1);
      
      // Calculate monthly running costs
      const monthlyRunningCosts = totalRunningCosts / 12;
      
      // Total monthly lease payment
      const monthlyLeasePayment = monthlyFinancePayment + monthlyRunningCosts;
      
      // Calculate FBT
      const fbtValue = formData.fbtMethod === 'statutory' 
        ? vehiclePrice * 0.2 // 20% statutory method
        : (monthlyLeasePayment * 12) * (businessUse / 100); // Operating cost method
      
      // Calculate tax savings
      const taxRate = getTaxRate(annualSalary);
      const annualTaxSavings = (monthlyLeasePayment * 12 + fbtValue) * taxRate;
      const monthlyTaxSavings = annualTaxSavings / 12;
      
      // Net cost after tax savings
      const netMonthlyCost = monthlyLeasePayment - monthlyTaxSavings;
      const netAnnualCost = netMonthlyCost * 12;
      
      // Calculate pay amount based on pay cycle
      let payAmount = netMonthlyCost;
      if (formData.payCycle === 'Fortnightly') {
        payAmount = netMonthlyCost / 2.17; // Monthly to fortnightly
      } else if (formData.payCycle === 'Weekly') {
        payAmount = netMonthlyCost / 4.33; // Monthly to weekly
      }
      
      const results = {
        vehiclePrice,
        naf: Math.round(naf),
        balloonPayment: Math.round(balloonPayment),
        stampDuty: Math.round(stampDuty),
        registration: Math.round(registration),
        establishmentFee,
        
        runningCosts: {
          insurance: Math.round(insurance),
          fuel: Math.round(fuelCost),
          maintenance: Math.round(maintenanceCost),
          tyres: Math.round(tyreCost),
          total: Math.round(totalRunningCosts)
        },
        
        monthlyFinancePayment: Math.round(monthlyFinancePayment),
        monthlyRunningCosts: Math.round(monthlyRunningCosts),
        monthlyLeasePayment: Math.round(monthlyLeasePayment),
        
        fbtValue: Math.round(fbtValue),
        taxRate: Math.round(taxRate * 100),
        monthlyTaxSavings: Math.round(monthlyTaxSavings),
        annualTaxSavings: Math.round(annualTaxSavings),
        
        netMonthlyCost: Math.round(netMonthlyCost),
        netAnnualCost: Math.round(netAnnualCost),
        payAmount: Math.round(payAmount),
        
        totalSavings: Math.round(annualTaxSavings * termYears)
      };
      
      setCalculations(results);
      
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save quote to database
  const handleSaveQuote = async () => {
    if (!calculations) return;
    
    setSaving(true);
    setSaveResult(null);
    
    try {
      const quoteData = {
        // Customer information
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        
        // Vehicle information
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear,
        vehiclePrice: formData.vehiclePrice,
        fuelType: formData.fuelType,
        engineSize: formData.engineSize,
        bodyStyle: formData.bodyStyle,
        isEV: formData.fuelType === 'electric',
        
        // Financial information
        monthlyPayment: calculations.monthlyLeasePayment,
        termYears: formData.termYears,
        employer: formData.employer,
        employerCode: formData.employerCode,
        portalSource: 'mxdealer',
        state: formData.state,
        annualKms: formData.annualKms,
        payCycle: formData.payCycle,
        fbtMethod: formData.fbtMethod,
        businessUsePercent: formData.businessUsePercent,
        
        // Finance calculations
        naf: calculations.naf,
        establishmentFee: calculations.establishmentFee,
        baseRate: formData.baseRate,
        balloonPayment: calculations.balloonPayment,
        
        // On-road costs
        stampDuty: calculations.stampDuty,
        registration: calculations.registration,
        
        // Running costs
        runningCosts: calculations.runningCosts,
        insurance: calculations.runningCosts.insurance,
        fuelCost: calculations.runningCosts.fuel,
        maintenanceCost: calculations.runningCosts.maintenance,
        tyreCost: calculations.runningCosts.tyres,
        totalAnnualCost: calculations.runningCosts.total,
        
        // Tax calculations
        income: formData.annualSalary,
        annualSalary: formData.annualSalary,
        taxSavings: calculations.annualTaxSavings,
        netAnnualCost: calculations.netAnnualCost,
        payAmount: calculations.payAmount
      };
      
      const result = await saveQuote(quoteData);
      
      if (result.success) {
        setSaveResult({ success: true, quoteId: result.quoteId });
        if (onQuoteSaved) {
          onQuoteSaved(result);
        }
      } else {
        setSaveResult({ success: false, error: result.error });
      }
      
    } catch (error) {
      console.error('Error saving quote:', error);
      setSaveResult({ success: false, error: 'Failed to save quote' });
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Comprehensive Novated Lease Calculator</h2>
          <p className="opacity-90">Calculate all running costs, tax savings, FBT and more</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Vehicle Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Car className="mr-2" size={20} />
                  Vehicle Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                    <input
                      type="text"
                      value={formData.vehicleMake}
                      onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g. Toyota"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g. Camry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <select
                      value={formData.vehicleYear}
                      onChange={(e) => setFormData({...formData, vehicleYear: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {Array.from({length: 6}, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Price ($)</label>
                    <input
                      type="number"
                      value={formData.vehiclePrice}
                      onChange={(e) => setFormData({...formData, vehiclePrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="65000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Engine Size (L)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.engineSize}
                      onChange={(e) => setFormData({...formData, engineSize: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="2.0"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="mr-2" size={20} />
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0400 000 000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employer</label>
                    <input
                      type="text"
                      value={formData.employer}
                      onChange={(e) => setFormData({...formData, employer: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {states.map(state => (
                        <option key={state.value} value={state.value}>{state.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="mr-2" size={20} />
                  Financial Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary ($)</label>
                    <input
                      type="number"
                      value={formData.annualSalary}
                      onChange={(e) => setFormData({...formData, annualSalary: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="80000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pay Cycle</label>
                    <select
                      value={formData.payCycle}
                      onChange={(e) => setFormData({...formData, payCycle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Fortnightly">Fortnightly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lease Term (Years)</label>
                    <select
                      value={formData.termYears}
                      onChange={(e) => setFormData({...formData, termYears: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={1}>1 Year</option>
                      <option value={2}>2 Years</option>
                      <option value={3}>3 Years</option>
                      <option value={4}>4 Years</option>
                      <option value={5}>5 Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual KMs</label>
                    <select
                      value={formData.annualKms}
                      onChange={(e) => setFormData({...formData, annualKms: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={10000}>10,000 km</option>
                      <option value={15000}>15,000 km</option>
                      <option value={20000}>20,000 km</option>
                      <option value={25000}>25,000 km</option>
                      <option value={30000}>30,000 km</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Use %</label>
                    <select
                      value={formData.businessUsePercent}
                      onChange={(e) => setFormData({...formData, businessUsePercent: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={0}>0%</option>
                      <option value={20}>20%</option>
                      <option value={50}>50%</option>
                      <option value={75}>75%</option>
                      <option value={100}>100%</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">FBT Method</label>
                    <select
                      value={formData.fbtMethod}
                      onChange={(e) => setFormData({...formData, fbtMethod: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="statutory">Statutory Method</option>
                      <option value="operating">Operating Cost Method</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateLease}
                disabled={loading || !formData.vehiclePrice || !formData.annualSalary}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2" size={20} />
                    Calculate Lease
                  </>
                )}
              </button>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {calculations ? (
                <>
                  {/* Summary Card */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Lease Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Vehicle Price:</span>
                        <span className="font-bold">{formatCurrency(calculations.vehiclePrice)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{formData.payCycle} Payment:</span>
                        <span className="font-bold text-2xl">{formatCurrency(calculations.payAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Annual Tax Savings:</span>
                        <span className="font-bold text-green-300">{formatCurrency(calculations.annualTaxSavings)}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/20 pt-3">
                        <span>Total Savings Over {formData.termYears} Years:</span>
                        <span className="font-bold text-xl text-green-300">{formatCurrency(calculations.totalSavings)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Detailed Breakdown</h3>
                    
                    {/* Finance Details */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Finance Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Net Amount Financed (NAF):</span>
                          <span className="font-medium">{formatCurrency(calculations.naf)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Balloon Payment:</span>
                          <span className="font-medium">{formatCurrency(calculations.balloonPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stamp Duty:</span>
                          <span className="font-medium">{formatCurrency(calculations.stampDuty)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Establishment Fee:</span>
                          <span className="font-medium">{formatCurrency(calculations.establishmentFee)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Running Costs */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Running Costs (Annual)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Insurance:</span>
                          <span className="font-medium">{formatCurrency(calculations.runningCosts.insurance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel:</span>
                          <span className="font-medium">{formatCurrency(calculations.runningCosts.fuel)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Maintenance:</span>
                          <span className="font-medium">{formatCurrency(calculations.runningCosts.maintenance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tyres:</span>
                          <span className="font-medium">{formatCurrency(calculations.runningCosts.tyres)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Registration:</span>
                          <span className="font-medium">{formatCurrency(calculations.registration)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-900 font-medium">Total Running Costs:</span>
                          <span className="font-bold">{formatCurrency(calculations.runningCosts.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tax Information */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Tax Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax Rate:</span>
                          <span className="font-medium">{calculations.taxRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">FBT Value:</span>
                          <span className="font-medium">{formatCurrency(calculations.fbtValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Tax Savings:</span>
                          <span className="font-medium text-green-600">{formatCurrency(calculations.monthlyTaxSavings)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual Tax Savings:</span>
                          <span className="font-medium text-green-600">{formatCurrency(calculations.annualTaxSavings)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Breakdown */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Monthly Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Finance Payment:</span>
                          <span className="font-medium">{formatCurrency(calculations.monthlyFinancePayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Running Costs:</span>
                          <span className="font-medium">{formatCurrency(calculations.monthlyRunningCosts)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-900 font-medium">Total Monthly Cost:</span>
                          <span className="font-bold">{formatCurrency(calculations.monthlyLeasePayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Less Tax Savings:</span>
                          <span className="font-medium text-green-600">-{formatCurrency(calculations.monthlyTaxSavings)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-900 font-medium">Net Monthly Cost:</span>
                          <span className="font-bold text-lg">{formatCurrency(calculations.netMonthlyCost)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Quote Button */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <button
                      onClick={handleSaveQuote}
                      disabled={saving}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center mb-4"
                    >
                      {saving ? (
                        <>
                          <Loader className="animate-spin mr-2" size={20} />
                          Saving Quote...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2" size={20} />
                          Save Quote
                        </>
                      )}
                    </button>

                    {saveResult && (
                      <div className={`p-4 rounded-lg ${saveResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <div className="flex items-center">
                          {saveResult.success ? (
                            <CheckCircle className="mr-2" size={20} />
                          ) : (
                            <AlertCircle className="mr-2" size={20} />
                          )}
                          <span className="font-medium">
                            {saveResult.success 
                              ? `Quote saved successfully! ID: ${saveResult.quoteId}`
                              : `Error: ${saveResult.error}`
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Calculator className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Calculate</h3>
                  <p className="text-gray-600">
                    Fill in the vehicle details and customer information to generate a comprehensive lease quote.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveCalculator;
