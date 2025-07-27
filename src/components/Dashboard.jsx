import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Users, 
  BarChart3, 
  Settings, 
  Calculator, 
  FileText, 
  Leaf, 
  TrendingUp, 
  DollarSign,
  Shield,
  Download,
  Plus,
  Eye,
  Edit,
  Save,
  LogOut,
  Menu,
  X,
  Target,
  Zap,
  Award,
  Building2,
  UserCheck,
  Database,
  Globe,
  RefreshCw,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

const MXDriveIQPlatform = () => {
  const [currentPortal, setCurrentPortal] = useState('mxdriveiq');
  const [userRole, setUserRole] = useState('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentView, setCurrentView] = useState('main');
  const [loading, setLoading] = useState(false);

  // Platform data states
  const [leaseData, setLeaseData] = useState({
    totalLeases: 156,
    evLeases: 89,
    pendingApplications: 23,
    carbonSaved: 45.6,
    costSavings: 125000
  });

  const [stats, setStats] = useState({
    totalQuotes: 245,
    totalApplications: 67,
    totalValue: 12450000,
    avgQuoteValue: 50816,
    thisMonth: 23,
    conversionRate: 27.3
  });

  // Employee personal data
  const [employeeData, setEmployeeData] = useState({
    personalEmissions: {
      vehicle: { type: 'Petrol SUV', monthlyKm: 1200, monthlyEmissions: 245.5 },
      alternatives: { bike: 0, walk: 0, publicTransport: 0 },
      monthlyTotal: 245.5,
      annualTotal: 2946
    },
    goals: {
      reductionTarget: 20,
      currentReduction: 12
    },
    achievements: [
      { id: 1, title: 'First Week Cyclist', earned: true, date: '2024-07-15' },
      { id: 2, title: 'Public Transport Champion', earned: false },
      { id: 3, title: 'Carbon Crusher', earned: true, date: '2024-07-10' }
    ]
  });

  // Quote calculator state
  const [quoteForm, setQuoteForm] = useState({
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    vehiclePrice: '',
    leaseTerm: 12,
    annualKm: 25000,
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  const [quoteResult, setQuoteResult] = useState(null);

  // Application form state
  const [applicationData, setApplicationData] = useState({
    personalDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      employerId: ''
    },
    vehicleDetails: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0
    },
    leaseDetails: {
      term: 12,
      annualKm: 25000,
      monthlyPayment: 0
    }
  });

  const [applicationStep, setApplicationStep] = useState(1);

  // Navigation component
  const Navigation = () => {
    const getNavItems = () => {
      switch (currentPortal) {
        case 'mxdriveiq':
          if (userRole === 'employee') {
            return [
              { id: 'dashboard', label: 'Personal Dashboard', icon: BarChart3 },
              { id: 'calculator', label: 'Lease Calculator', icon: Calculator },
              { id: 'applications', label: 'My Applications', icon: FileText },
              { id: 'emissions-tracker', label: 'Emissions Tracker', icon: Leaf },
              { id: 'achievements', label: 'Achievements', icon: Award }
            ];
          } else {
            return [
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'calculator', label: 'Lease Calculator', icon: Calculator },
              { id: 'applications', label: 'Applications', icon: FileText },
              { id: 'emissions', label: 'Emissions Reporting', icon: Leaf },
              { id: 'ev-tips', label: 'EV Uptake Tips', icon: Zap },
              { id: 'carbon-credits', label: 'Carbon Credits', icon: Globe }
            ];
          }
        case 'mxdealer':
          return [
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'quotes', label: 'Quotes', icon: Calculator },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'metrics', label: 'Metrics', icon: TrendingUp },
            { id: 'inventory', label: 'Vehicle Inventory', icon: Car }
          ];
        case 'admin':
          return [
            { id: 'dashboard', label: 'System Overview', icon: Database },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'rates', label: 'Rate Management', icon: DollarSign },
            { id: 'applications', label: 'All Applications', icon: FileText },
            { id: 'settings', label: 'System Settings', icon: Settings }
          ];
        default:
          return [];
      }
    };

    const navItems = getNavItems();

    return (
      <nav className="bg-white shadow-sm border-r border-gray-200 h-full">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {currentPortal === 'mxdriveiq' && 'MXDriveIQ'}
              {currentPortal === 'mxdealer' && 'MXDealerAdvantage'}
              {currentPortal === 'admin' && 'Admin Portal'}
            </h2>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <div className={`space-y-2 ${showMobileMenu ? 'block' : 'hidden md:block'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  };

  // Dashboard Components
  const EmployerDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Fleet Dashboard</h1>
        <button
          onClick={() => setLoading(!loading)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Total Leases</h3>
          <p className="text-3xl font-bold text-blue-600">{leaseData.totalLeases}</p>
          <p className="text-sm text-gray-500 mt-2">+12 this month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">EV Leases</h3>
          <p className="text-3xl font-bold text-green-600">{leaseData.evLeases}</p>
          <p className="text-sm text-gray-500 mt-2">{((leaseData.evLeases / leaseData.totalLeases) * 100).toFixed(1)}% of fleet</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Carbon Saved</h3>
          <p className="text-3xl font-bold text-green-600">{leaseData.carbonSaved}t</p>
          <p className="text-sm text-gray-500 mt-2">CO2e annually</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Cost Savings</h3>
          <p className="text-3xl font-bold text-purple-600">${(leaseData.costSavings / 1000).toFixed(0)}k</p>
          <p className="text-sm text-gray-500 mt-2">Annual savings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">EV Uptake Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Current EV Adoption</span>
                <span className="text-sm text-gray-500">{((leaseData.evLeases / leaseData.totalLeases) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(leaseData.evLeases / leaseData.totalLeases) * 100}%` }}
                ></div>
              </div>
            </div>
            <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Set EV Target
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
              <FileText className="w-5 h-5 mx-auto mb-1" />
              Download Report
            </button>
            <button className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
              <Globe className="w-5 h-5 mx-auto mb-1" />
              Buy Carbon Credits
            </button>
            <button className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
              <Zap className="w-5 h-5 mx-auto mb-1" />
              EV Tips
            </button>
            <button className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium">
              <Database className="w-5 h-5 mx-auto mb-1" />
              Fleet Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DealerDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dealer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Total Quotes</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalQuotes}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Applications</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalApplications}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.conversionRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Total Value</h3>
          <p className="text-3xl font-bold text-green-600">${(stats.totalValue / 1000000).toFixed(1)}M</p>
        </div>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">1,247</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Active Leases</h3>
          <p className="text-3xl font-bold text-green-600">856</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Pending Applications</h3>
          <p className="text-3xl font-bold text-yellow-600">67</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">System Health</h3>
          <p className="text-3xl font-bold text-green-600">99.9%</p>
        </div>
      </div>
    </div>
  );

  // Lease Calculator Component
  const LeaseCalculator = () => {
    const calculateLease = () => {
      const price = parseFloat(quoteForm.vehiclePrice) || 0;
      const term = parseInt(quoteForm.leaseTerm) || 12;
      const residualValue = price * 0.4; // 40% residual
      const depreciationAmount = price - residualValue;
      const monthlyDepreciation = depreciationAmount / term;
      const interest = (price + residualValue) * 0.05 / 12; // 5% annual rate
      const monthlyPayment = monthlyDepreciation + interest;

      const result = {
        monthlyPayment: monthlyPayment.toFixed(2),
        totalCost: (monthlyPayment * term).toFixed(2),
        residualValue: residualValue.toFixed(2),
        taxSavings: (monthlyPayment * 0.37 * term).toFixed(2) // Estimated 37% tax bracket
      };

      setQuoteResult(result);
    };

    const handleInputChange = (field, value) => {
      setQuoteForm(prev => ({ ...prev, [field]: value }));
    };

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Novated Lease Calculator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Vehicle Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Make</label>
                <input
                  type="text"
                  value={quoteForm.vehicleMake}
                  onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                  placeholder="e.g., Toyota"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
                <input
                  type="text"
                  value={quoteForm.vehicleModel}
                  onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                  placeholder="e.g., Camry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  value={quoteForm.vehicleYear}
                  onChange={(e) => handleInputChange('vehicleYear', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Price ($)</label>
                <input
                  type="number"
                  value={quoteForm.vehiclePrice}
                  onChange={(e) => handleInputChange('vehiclePrice', e.target.value)}
                  placeholder="45000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lease Term (months)</label>
                <select
                  value={quoteForm.leaseTerm}
                  onChange={(e) => handleInputChange('leaseTerm', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                  <option value={36}>36 months</option>
                  <option value={48}>48 months</option>
                  <option value={60}>60 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual KM</label>
                <input
                  type="number"
                  value={quoteForm.annualKm}
                  onChange={(e) => handleInputChange('annualKm', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={calculateLease}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Calculate Lease
              </button>
            </div>
          </div>

          {quoteResult && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Lease Calculation Results</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium">Monthly Payment:</span>
                  <span className="text-xl font-bold text-blue-600">${quoteResult.monthlyPayment}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span>Total Cost:</span>
                  <span className="font-semibold">${quoteResult.totalCost}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span>Residual Value:</span>
                  <span className="font-semibold">${quoteResult.residualValue}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span>Estimated Tax Savings:</span>
                  <span className="font-semibold text-green-600">${quoteResult.taxSavings}</span>
                </div>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Apply for This Lease
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Application Form Component
  const ApplicationForm = () => {
    const handleInputChange = (section, field, value) => {
      setApplicationData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    };

    const handleSubmit = () => {
      alert('Application submitted successfully!');
      setApplicationStep(1);
      setActiveTab('dashboard');
    };

    const nextStep = () => {
      setApplicationStep(prev => Math.min(4, prev + 1));
    };

    const prevStep = () => {
      setApplicationStep(prev => Math.max(1, prev - 1));
    };

    const renderStep = () => {
      switch (applicationStep) {
        case 1:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={applicationData.personalDetails.firstName}
                    onChange={(e) => handleInputChange('personalDetails', 'firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={applicationData.personalDetails.lastName}
                    onChange={(e) => handleInputChange('personalDetails', 'lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={applicationData.personalDetails.email}
                    onChange={(e) => handleInputChange('personalDetails', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={applicationData.personalDetails.phone}
                    onChange={(e) => handleInputChange('personalDetails', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  <input
                    type="text"
                    value={applicationData.vehicleDetails.make}
                    onChange={(e) => handleInputChange('vehicleDetails', 'make', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={applicationData.vehicleDetails.model}
                    onChange={(e) => handleInputChange('vehicleDetails', 'model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={applicationData.vehicleDetails.year}
                    onChange={(e) => handleInputChange('vehicleDetails', 'year', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={applicationData.vehicleDetails.price}
                    onChange={(e) => handleInputChange('vehicleDetails', 'price', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Lease Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lease Term (months)</label>
                  <select
                    value={applicationData.leaseDetails.term}
                    onChange={(e) => handleInputChange('leaseDetails', 'term', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={12}>12 months</option>
                    <option value={24}>24 months</option>
                    <option value={36}>36 months</option>
                    <option value={48}>48 months</option>
                    <option value={60}>60 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual KM</label>
                  <input
                    type="number"
                    value={applicationData.leaseDetails.annualKm}
                    onChange={(e) => handleInputChange('leaseDetails', 'annualKm', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review & Submit</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Application Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>{applicationData.personalDetails.firstName} {applicationData.personalDetails.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <span>{applicationData.vehicleDetails.year} {applicationData.vehicleDetails.make} {applicationData.vehicleDetails.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>${applicationData.vehicleDetails.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Term:</span>
                    <span>{applicationData.leaseDetails.term} months</span>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Novated Lease Application</h1>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= applicationStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {renderStep()}

          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              disabled={applicationStep === 1}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {applicationStep === 4 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Application
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Emissions Reporting Component
  const EmissionsReporting = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Emissions Reporting & Data Capture</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Scope 2 & 3 Emissions</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>Fleet Emissions (Scope 3)</span>
              <span className="font-semibold">245.6 tonnes CO2e</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>Energy Use (Scope 2)</span>
              <span className="font-semibold">89.2 tonnes CO2e</span>
            </div>
            <div className="flex justify-between items-center py-2 font-bold">
              <span>Total Emissions</span>
              <span>334.8 tonnes CO2e</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Grey Fleet Data Capture</h2>
          <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors mb-4">
            Upload Fleet Data
          </button>
          <p className="text-gray-600 text-sm">
            Capture missing grey fleet data to complete your Scope 3 reporting obligations.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Carbon Credit Marketplace</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Renewable Energy Credits</h3>
            <p className="text-sm text-gray-600 mt-1">Australian certified RECs</p>
            <p className="text-lg font-bold text-green-600 mt-2">$15.50 / tonne</p>
            <button className="w-full mt-3 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
              Purchase
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Forest Carbon Credits</h3>
            <p className="text-sm text-gray-600 mt-1">Native reforestation projects</p>
            <p className="text-lg font-bold text-green-600 mt-2">$22.80 / tonne</p>
            <button className="w-full mt-3 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
              Purchase
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Direct Air Capture</h3>
            <p className="text-sm text-gray-600 mt-1">Advanced DAC technology</p>
            <p className="text-lg font-bold text-green-600 mt-2">$89.00 / tonne</p>
            <button className="w-full mt-3 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
              Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentPortal === 'mxdriveiq') {
          return <EmployerDashboard />;
        } else if (currentPortal === 'mxdealer') {
          return <DealerDashboard />;
        } else {
          return <AdminDashboard />;
        }
      case 'calculator':
        return <LeaseCalculator />;
      case 'applications':
        return <ApplicationForm />;
      case 'emissions':
        return <EmissionsReporting />;
      default:
        return <EmployerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://static.wixstatic.com/media/9c690e_1417a61dc4164e59b7fc0a0ad49b7c82~mv2.png" 
                alt="millarX Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">millarX</h1>
                <p className="text-xs text-gray-500">
                  {currentPortal === 'mxdriveiq' && 'DriveIQ Platform'}
                  {currentPortal === 'mxdealer' && 'DealerAdvantage Platform'}
                  {currentPortal === 'admin' && 'Admin Platform'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPortal('mxdriveiq')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    currentPortal === 'mxdriveiq'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  MXDriveIQ
                </button>
                <button
                  onClick={() => setCurrentPortal('mxdealer')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    currentPortal === 'mxdealer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  DealerAdvantage
                </button>
                <button
                  onClick={() => setCurrentPortal('admin')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    currentPortal === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Admin
                </button>
              </div>
              
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <Navigation />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MXDriveIQPlatform;