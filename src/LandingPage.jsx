import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Calculator, Shield, ArrowRight, Leaf, Car, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

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
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                DriveIQ
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your intelligent platform for novated leasing management, fleet tracking, 
              and Scope 3 emissions reporting. Choose your portal below to get started.
            </p>
          </div>

          {/* Portal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Employee Portal */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Employee Portal</h3>
              <p className="text-gray-600 mb-6">
                Track your commute, manage your vehicle lease, and monitor your environmental impact.
              </p>
              <button 
                onClick={() => navigate('/employee')}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Access Portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Employer Portal */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Employer Portal</h3>
              <p className="text-gray-600 mb-6">
                Manage your company's fleet, track sustainability metrics, and oversee employee benefits.
              </p>
              <button 
                onClick={() => navigate('/employer')}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Access Portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* MXDealer Portal */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">MXdrive IQ</h3>
              <p className="text-gray-600 mb-6">
                Self-service novated lease calculator and application portal for dealers and customers.
              </p>
              <button 
                onClick={() => navigate('/mxdealer')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Access Portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Admin Portal */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin Portal</h3>
              <p className="text-gray-600 mb-6">
                System administration, user management, and platform configuration tools.
              </p>
              <button 
                onClick={() => navigate('/admin')}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Admin Access
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Quick Actions</h3>
              <p className="text-lg text-slate-600">
                Jump straight to the tools you need most
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/form')}
                className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center justify-center space-x-3">
                  <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Employee Entry Form</span>
                </div>
              </button>

              <button
                onClick={() => navigate('/mxdealer/dashboard?tab=calculator')}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>Lease Calculator</span>
                </div>
              </button>

              <button
                onClick={() => navigate('/employee/dashboard')}
                className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center justify-center space-x-3">
                  <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>View Dashboard</span>
                </div>
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Platform Features</h3>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Comprehensive tools for managing your fleet, tracking emissions, and optimizing costs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Scope 3 Tracking</h4>
                <p className="text-slate-600">
                  Comprehensive emissions tracking for grey fleet and employee transport
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Fleet Management</h4>
                <p className="text-slate-600">
                  Complete visibility and control over your company's vehicle fleet
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Analytics & Reporting</h4>
                <p className="text-slate-600">
                  Detailed insights and reports for informed decision making
                </p>
              </div>
            </div>
          </div>

          {/* Legacy Access */}
          <div className="bg-slate-100/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 text-center">
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Legacy System Access</h4>
            <p className="text-slate-600 mb-4">Need to access the original system components?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-slate-600 hover:text-slate-800 underline text-sm"
              >
                Legacy Login
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-600 hover:text-slate-800 underline text-sm"
              >
                Legacy Dashboard
              </button>
              <button
                onClick={() => navigate('/employee-login')}
                className="text-slate-600 hover:text-slate-800 underline text-sm"
              >
                Legacy Employee Login
              </button>
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
                  © {new Date().getFullYear()} millarX • DriveIQ Platform
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
};

export default LandingPage;
