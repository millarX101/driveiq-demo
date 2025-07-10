import React, { useState, useEffect } from "react";

export default function LandingPage() {
  const [demoMode, setDemoMode] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (demoMode) {
      setCompanyId("bens");
    } else {
      setCompanyId("");
    }
  }, [demoMode]);

  const handleEnter = async (target) => {
    if (!companyId) {
      alert("Please enter or select a company ID first.");
      return;
    }

    setIsLoading(true);
    
    // Store company ID in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem("driveiq_company", companyId);
    }
    
    // Simulate navigation with actual URL construction
    setTimeout(() => {
      const targetUrl = `${target}?company=${companyId}`;
      console.log(`Navigating to: ${targetUrl}`);
      
      // In a real React Router environment, this would be:
      // navigate(targetUrl);
      
      // For now, we'll simulate by updating the window location
      if (typeof window !== 'undefined') {
        window.location.href = targetUrl;
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleCalculator = () => {
    console.log("Navigating to calculator");
    // In a real React Router environment, this would be:
    // navigate("/calculator");
    
    // For now, we'll simulate by updating the window location
    if (typeof window !== 'undefined') {
      window.location.href = "/calculator";
    }
  };

  return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(147, 51, 234, 0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="https://static.wixstatic.com/media/9c690e_1417a61dc4164e59b7fc0a0ad49b7c82~mv2.png" 
                alt="millarX Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">millarX</h1>
              <p className="text-xs text-slate-500 font-medium">DriveIQ Platform</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Simple. Reliable. Trusted.</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                DriveIQ
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your intelligent platform for novated leasing management. Streamline employee entries, 
              track fleet data, and optimize Scope 3 emissions reporting.
            </p>
          </div>

          {/* Configuration Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Select Your Configuration
            </h2>

            {/* Demo Mode Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8 p-4 bg-slate-50 rounded-xl">
              <span className={`text-sm font-medium transition-colors ${!demoMode ? 'text-slate-700' : 'text-slate-400'}`}>
                Production Mode
              </span>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-200 ${
                  demoMode ? 'bg-gradient-to-r from-purple-500 to-violet-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    demoMode ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${demoMode ? 'text-slate-700' : 'text-slate-400'}`}>
                Demo Mode
              </span>
            </div>

            {/* Company ID Input/Display */}
            {demoMode ? (
              <div className="mb-8">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <p className="text-purple-800 font-medium">
                    Demo company ID: <span className="font-bold text-purple-900">bens</span>
                  </p>
                  <p className="text-purple-600 text-sm mt-1">
                    Using sample data for demonstration purposes
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <label htmlFor="companyId" className="block text-sm font-medium text-slate-700 mb-3">
                  Company ID
                </label>
                <input
                  id="companyId"
                  type="text"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  placeholder="Enter your unique company identifier"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white/90 backdrop-blur-sm text-center font-medium"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleEnter("/form")}
                disabled={isLoading}
                className="group relative bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Employee Entry</span>
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-600 rounded-xl">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>

              <button
                onClick={() => handleEnter("/dashboard")}
                disabled={isLoading}
                className="group relative bg-gradient-to-r from-slate-700 to-slate-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Employer Dashboard</span>
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-700 rounded-xl">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Calculator Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Self-Service Tools
              </h3>
              <p className="text-slate-600 mb-6">
                Calculate your potential savings with our intelligent lease calculator
              </p>
              <button
                onClick={handleCalculator}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>millarX Lease Calculator</span>
                </span>
              </button>
            </div>
          </div>

          {/* Grey Fleet Section */}
          <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Grey Fleet Data Capture</h3>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive tracking and management of employee-owned vehicles used for business purposes. 
                Understanding your grey fleet requirements is critical for compliance, cost optimization, 
                and achieving your sustainability goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Compliance & Risk Management</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Ensure proper insurance coverage, duty of care obligations, and regulatory compliance 
                      for all employee-owned vehicles used for business travel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Cost Optimization</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Track reimbursement rates, fuel efficiency, and maintenance costs to optimize 
                      your total fleet expenditure and identify potential savings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Scope 3 Emissions Tracking</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Capture comprehensive emissions data from grey fleet vehicles to meet 
                      sustainability reporting requirements and support net-zero initiatives.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Strategic Fleet Planning</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Analyze usage patterns and requirements to make informed decisions 
                      about transitioning grey fleet vehicles to managed fleet solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-lg font-semibold text-slate-800">Why Grey Fleet Understanding Matters</h4>
              </div>
              <p className="text-slate-700 text-center leading-relaxed">
                <strong>Did you know?</strong> Grey fleet vehicles often represent 60-80% of total business travel emissions, 
                yet remain largely invisible to traditional fleet management. DriveIQ's comprehensive data capture 
                ensures complete visibility, enabling better decision-making for cost reduction, compliance, 
                and environmental responsibility.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Fast Approvals</h3>
              <p className="text-slate-600 text-sm">Streamlined approval process with clear communication at every step</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Transparent Pricing</h3>
              <p className="text-slate-600 text-sm">Straight-up pricing with no hidden extras or surprises</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Personal Service</h3>
              <p className="text-slate-600 text-sm">We listen first, tailor second, and stay with you for the life of the lease</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-slate-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <p className="text-slate-600 text-sm">
                  © {new Date().getFullYear()} millarX • Scope 3 Reporting Pilot
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-slate-500 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Platform Status: Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}