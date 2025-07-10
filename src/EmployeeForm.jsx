import React, { useEffect, useState } from "react";

export default function EmployeeForm() {
  const [companyId, setCompanyId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccessOptions, setShowSuccessOptions] = useState(false);
  const [showCompletionPage, setShowCompletionPage] = useState(false);
  const [submittedVehicles, setSubmittedVehicles] = useState([]);
  const [savedCredentials, setSavedCredentials] = useState({ employeeId: "", companyId: "" });
  const totalSteps = 3;

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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const record = {
      ...form,
      companyId,
      kmPerYear: +form.kmPerYear,
      fuelEfficiency: +form.fuelEfficiency,
      businessUse: +form.businessUse,
      hasNovated: form.hasNovated
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Submitting:", record);
      
      // Save credentials for potential next vehicle
      setSavedCredentials({
        employeeId: form.employeeId,
        companyId: companyId
      });
      
      // Add to submitted vehicles list
      setSubmittedVehicles(prev => [...prev, {
        vehicleType: form.vehicleType,
        fuelType: form.fuelType,
        kmPerYear: form.kmPerYear,
        fuelEfficiency: form.fuelEfficiency
      }]);
      
      // Show success options instead of navigating away
      setShowSuccessOptions(true);
      
    } catch (err) {
      console.error(err);
      alert("Submission failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnotherVehicle = () => {
    // Reset form but keep employee credentials
    setForm({
      employeeId: savedCredentials.employeeId,
      vehicleType: "",
      fuelType: "Petrol",
      kmPerYear: 15000,
      fuelEfficiency: 7.5,
      businessUse: 0,
      hasNovated: false
    });
    setStep(1);
    setShowSuccessOptions(false);
  };

  const handleFinishAndLeave = () => {
    // Show completion page instead of immediate redirect
    setShowCompletionPage(true);
    setShowSuccessOptions(false);
  };

  const handleOpenCalculator = () => {
    // Open calculator in new tab
    window.open('/calculator', '_blank');
  };

  // Check if user has any non-EV vehicles
  const hasNonEVVehicles = submittedVehicles.some(vehicle => vehicle.fuelType !== 'EV');

  // Calculate potential carbon savings by switching to EV
  const calculateCarbonSavings = () => {
    const nonEVVehicles = submittedVehicles.filter(vehicle => vehicle.fuelType !== 'EV');
    let totalSavings = 0;

    nonEVVehicles.forEach(vehicle => {
      // Carbon emissions factors (kg CO2 per litre)
      const emissionFactors = {
        'Petrol': 2.3,
        'Diesel': 2.7,
        'Hybrid': 1.15 // Roughly half of petrol
      };

      const factor = emissionFactors[vehicle.fuelType] || 2.3;
      const annualFuelConsumption = (vehicle.kmPerYear * vehicle.fuelEfficiency) / 100;
      const annualEmissions = annualFuelConsumption * factor;
      
      // Assume EV emissions are ~0.1 tonnes CO2/year (accounting for electricity grid)
      const evEmissions = 0.1;
      const savings = Math.max(0, (annualEmissions / 1000) - evEmissions);
      totalSavings += savings;
    });

    return totalSavings.toFixed(1);
  };

  const canProceedToStep2 = form.employeeId && form.vehicleType;
  const canProceedToStep3 = canProceedToStep2 && form.fuelType && form.kmPerYear && form.fuelEfficiency;

  const getStepTitle = (stepNum) => {
    switch(stepNum) {
      case 1: return "Basic Information";
      case 2: return "Vehicle Details";
      case 3: return "Usage & Lease Details";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(147, 51, 234, 0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="https://static.wixstatic.com/media/9c690e_1417a61dc4164e59b7fc0a0ad49b7c82~mv2.png" 
                  alt="millarX Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">millarX DriveIQ</h1>
                <p className="text-sm text-slate-600">Vehicle Entry Portal</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Company: <span className="font-semibold text-purple-700">{companyId || "Not Set"}</span></p>
              <p className="text-xs text-slate-500">Scope 3 & Grey Fleet Tracking</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto py-8 px-6">
        {!companyId && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-700 font-medium">Missing company ID</p>
            </div>
            <p className="text-red-600 text-sm mt-1">
              Please use a proper link with <code className="bg-red-100 px-1 rounded">?company=xyz</code> or try <code className="bg-red-100 px-1 rounded">?demo=true</code>
            </p>
          </div>
        )}

        {/* Progress Indicator */}
        {!showSuccessOptions && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Vehicle Information</h2>
              <span className="text-sm text-slate-600">Step {step} of {totalSteps}</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    stepNum === step 
                      ? 'bg-purple-600 text-white' 
                      : stepNum < step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {stepNum < step ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < 3 && <div className={`flex-1 h-1 rounded ${stepNum < step ? 'bg-green-500' : 'bg-slate-200'}`} />}
                </React.Fragment>
              ))}
            </div>
            
            <p className="text-slate-600 font-medium">{getStepTitle(step)}</p>
          </div>
        )}

        {/* Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          
          {/* Completion Page */}
          {showCompletionPage ? (
            <div className="text-center space-y-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Thank You for Your Submission!
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Your vehicle information has been successfully recorded for Scope 3 emissions tracking.
                </p>
              </div>

              {/* Submitted Vehicles Summary */}
              <div className="bg-slate-50 rounded-xl p-6 text-left">
                <h3 className="font-semibold text-slate-800 mb-4">Vehicles Submitted:</h3>
                <div className="space-y-2">
                  {submittedVehicles.map((vehicle, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
                      <div>
                        <p className="font-medium text-slate-700">{vehicle.vehicleType}</p>
                        <p className="text-sm text-slate-500">{vehicle.fuelType} • {vehicle.kmPerYear.toLocaleString()} km/year</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">
                          {vehicle.fuelEfficiency} {vehicle.fuelType === "EV" ? "kWh/100km" : "L/100km"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EV Promotion for Non-EV Users */}
              {hasNonEVVehicles && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="text-xl font-bold text-green-800">
                      Go Electric & Save!
                    </h3>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                      </svg>
                      <span className="font-bold text-green-800 text-lg">
                        You could save {calculateCarbonSavings()} tonnes of CO₂ emissions per year
                      </span>
                    </div>
                    <p className="text-green-700 text-sm text-center">
                      by switching your current {submittedVehicles.filter(v => v.fuelType !== 'EV').length > 1 ? 'vehicles' : 'vehicle'} to electric
                    </p>
                  </div>
                  
                  <div className="space-y-3 text-green-700 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm">
                        <strong>100% FBT exemption</strong> - Electric vehicles are completely tax-free through salary packaging
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm">
                        <strong>Lower running costs</strong> - Electricity is significantly cheaper than petrol or diesel
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm">
                        <strong>Reduce your carbon footprint</strong> - Help your company achieve net-zero targets
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleOpenCalculator}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Calculate Your EV Savings Now</span>
                    </div>
                  </button>
                  
                  <p className="text-sm text-green-600 mt-3 text-center">
                    See your potential tax savings and environmental impact
                  </p>
                </div>
              )}

              {/* Close Instructions */}
              <div className="bg-slate-100 rounded-xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-slate-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-semibold text-slate-700">All Done!</h4>
                </div>
                <p className="text-slate-600 text-center">
                  Your information has been securely saved. You can now close this window 
                  or continue exploring millarX services.
                </p>
              </div>

              {/* Additional Action */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    setShowCompletionPage(false);
                    setShowSuccessOptions(false);
                    setSubmittedVehicles([]);
                    setForm({
                      employeeId: "",
                      vehicleType: "",
                      fuelType: "Petrol",
                      kmPerYear: 15000,
                      fuelEfficiency: 7.5,
                      businessUse: 0,
                      hasNovated: false
                    });
                    setStep(1);
                  }}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm underline"
                >
                  Start Over for Another Employee
                </button>
              </div>
            </div>
          ) : 
          
          /* Success Options Screen */
          showSuccessOptions ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Vehicle Submitted Successfully!</h3>
                <p className="text-slate-600">
                  Your vehicle information has been recorded. Do you have any other cars you use for commuting to and from work?
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Just submitted:</p>
                <p className="font-semibold text-slate-800">{form.vehicleType}</p>
                <p className="text-sm text-slate-500">{form.fuelType} • {form.kmPerYear.toLocaleString()} km/year</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddAnotherVehicle}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Another Commuting Vehicle</span>
                  </div>
                </button>

                <button
                  onClick={handleFinishAndLeave}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Finish & Complete Submission</span>
                  </div>
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Your employee credentials are saved for this session
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Employee ID or Initials
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={form.employeeId}
                      onChange={handleChange}
                      placeholder="e.g., JD001 or John D."
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Vehicle Type
                    </label>
                    <input
                      type="text"
                      name="vehicleType"
                      value={form.vehicleType}
                      onChange={handleChange}
                      placeholder="e.g., Toyota Corolla Hybrid, BMW X3"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    Continue to Vehicle Details
                  </button>
                </div>
              )}

              {/* Step 2: Vehicle Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Fuel Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "Petrol", icon: "⛽", color: "blue" },
                        { value: "Diesel", icon: "🚛", color: "orange" },
                        { value: "Hybrid", icon: "🔋", color: "green" },
                        { value: "EV", icon: "⚡", color: "purple" }
                      ].map((fuel) => (
                        <button
                          key={fuel.value}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, fuelType: fuel.value }))}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            form.fuelType === fuel.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{fuel.icon}</div>
                          <div className="font-medium text-slate-700">{fuel.value}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Estimated Kilometers per Year
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="kmPerYear"
                        value={form.kmPerYear}
                        onChange={handleChange}
                        min="1000"
                        max="100000"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">km/year</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Fuel Efficiency ({form.fuelType === "EV" ? "kWh/100km" : "L/100km"})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="fuelEfficiency"
                        value={form.fuelEfficiency}
                        onChange={handleChange}
                        step="0.1"
                        min="1"
                        max="50"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                        {form.fuelType === "EV" ? "kWh/100km" : "L/100km"}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none"
                    >
                      Continue to Usage Details
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Usage & Lease Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-4">
                      Did you claim business use for this car on your tax return?
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="hasBusiness"
                          value="no"
                          checked={form.businessUse === 0}
                          onChange={() => setForm(prev => ({ ...prev, businessUse: 0 }))}
                          className="w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-slate-700">No, personal use only</span>
                      </label>
                      <label className="flex items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="hasBusiness"
                          value="yes"
                          checked={form.businessUse !== 0}
                          onChange={() => setForm(prev => ({ ...prev, businessUse: 50 }))}
                          className="w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-slate-700">Yes, I claimed business use</span>
                      </label>
                    </div>

                    {form.businessUse !== 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          Business use percentage
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="businessUse"
                            min="1"
                            max="100"
                            value={form.businessUse}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white"
                            placeholder="Enter business use %"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-4">
                      Is this car on a novated lease?
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="hasNovated"
                          value="no"
                          checked={!form.hasNovated}
                          onChange={() => setForm(prev => ({ ...prev, hasNovated: false }))}
                          className="w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-slate-700">No</span>
                      </label>
                      <label className="flex items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="hasNovated"
                          value="yes"
                          checked={form.hasNovated}
                          onChange={() => setForm(prev => ({ ...prev, hasNovated: true }))}
                          className="w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-slate-700">Yes</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!companyId || isSubmitting}
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none relative"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Submitting...
                        </div>
                      ) : (
                        "Submit Vehicle Information"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Card */}
        {step > 1 && !showSuccessOptions && !showCompletionPage && (
          <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <h3 className="font-semibold text-slate-800 mb-3">Summary</h3>
            <div className="text-sm text-slate-600 space-y-1">
              <div>Employee: <span className="font-medium">{form.employeeId || "Not entered"}</span></div>
              <div>Vehicle: <span className="font-medium">{form.vehicleType || "Not entered"}</span></div>
              {step > 2 && (
                <>
                  <div>Fuel Type: <span className="font-medium">{form.fuelType}</span></div>
                  <div>Annual KM: <span className="font-medium">{form.kmPerYear?.toLocaleString()}</span></div>
                  <div>Efficiency: <span className="font-medium">{form.fuelEfficiency} {form.fuelType === "EV" ? "kWh/100km" : "L/100km"}</span></div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-sm text-slate-500 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-t border-slate-200 pt-6">
            © {new Date().getFullYear()} millarX • Scope 3 Reporting Pilot
          </div>
        </div>
      </footer>
    </div>
  );
}