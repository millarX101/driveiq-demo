import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, FileText, Users, TrendingUp, ArrowRight, Car } from 'lucide-react';

const MXDealerLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MXdrive IQ</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Self-Service Novated Lease Tool
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use this self-service novated lease quoting and application tool to set up and apply for 
            your own lease. Fixed interest rates, adjustable budgets and full disclosure on all the 
            stuff you need to know to make an informed decision. We don't have salespeople, so if 
            you need help just ask.
          </p>
        </div>

        {/* Main CTA */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Lease Calculator
          </h3>
          <p className="text-gray-600 mb-6">
            Calculate your novated lease savings
          </p>
          <button
            onClick={() => navigate('/mxdealer/login')}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
          >
            Start Calculator
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Everything You Need for Novated Leasing
          </h3>
          <p className="text-gray-600 text-center mb-8">
            Comprehensive tools for calculating, quoting, and managing novated lease applications
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Smart Calculator</h4>
              <p className="text-gray-600">
                Advanced calculations including FBT, tax savings, running costs, and stamp duty
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Application Portal</h4>
              <p className="text-gray-600">
                Streamlined application process with PDF generation, email automation, and tracking
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Admin Dashboard</h4>
              <p className="text-gray-600">
                Comprehensive management dashboard with analytics, quote tracking, and rate management
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose MXdrive IQ?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Fixed Interest Rates</h4>
                  <p className="text-gray-600 text-sm">Transparent pricing with no hidden fees</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Adjustable Budgets</h4>
                  <p className="text-gray-600 text-sm">Flexible payment options to suit your needs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Full Disclosure</h4>
                  <p className="text-gray-600 text-sm">Complete transparency on all costs and savings</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">No Salespeople</h4>
                  <p className="text-gray-600 text-sm">Self-service platform with expert support when needed</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Expert Support</h4>
                  <p className="text-gray-600 text-sm">Professional guidance available when you need it</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Fast Processing</h4>
                  <p className="text-gray-600 text-sm">Quick approvals and streamlined setup</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This calculator provides estimates only. Final lease terms subject to approval and may vary.
          </p>
        </div>
      </main>
    </div>
  );
};

export default MXDealerLanding;
