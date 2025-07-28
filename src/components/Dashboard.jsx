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
  Globe
} from 'lucide-react';

// Supabase client simulation (you'll need to replace with actual Supabase setup)
const supabaseClient = {
  auth: {
    signIn: async (credentials) => ({ user: { id: 1, email: credentials.email, role: 'admin' } }),
    signOut: async () => ({}),
    getUser: async () => ({ user: { id: 1, email: 'admin@millarx.com', role: 'admin' } })
  },
  from: (table) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: [], error: null }),
    update: () => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null })
  })
};

const NovatedLeasingPlatform = () => {
  const [currentPortal, setCurrentPortal] = useState('mxdriveiq');
  const [userRole, setUserRole] = useState('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentView, setCurrentView] = useState('main');

  // Sample data
  const [leaseData, setLeaseData] = useState({
    totalLeases: 156,
    evLeases: 89,
    pendingApplications: 23,
    carbonSaved: 45.6,
    costSavings: 125000
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
    ],
    weeklyLog: [
      { date: '2024-07-22', car: 45, bike: 5, walk: 2, publicTransport: 0 },
      { date: '2024-07-23', car: 52, bike: 0, walk: 1, publicTransport: 8 },
      { date: '2024-07-24', car: 38, bike: 12, walk: 3, publicTransport: 0 },
      { date: '2024-07-25', car: 41, bike: 8, walk: 2, publicTransport: 5 },
      { date: '2024-07-26', car: 35, bike: 15, walk: 4, publicTransport: 0 }
    ]
  });

  const [transportLog, setTransportLog] = useState({
    date: new Date().toISOString().split('T')[0],
    car: 0,
    bike: 0,
    walk: 0,
    publicTransport: 0
  });

  const [evTips] = useState([
    {
      id: 1,
      category: 'Infrastructure',
      title: 'Install Workplace Charging',
      impact: 'High',
      effort: 'Medium',
      description: 'Installing workplace charging stations can increase EV adoption by 3x',
      actionPlan: 'Partner with charging providers for installation and maintenance',
      roi: '250% over 3 years'
    },
    {
      id: 2,
      category: 'Education',
      title: 'EV Experience Days',
      impact: 'High',
      effort: 'Low',
      description: 'Organize test drive events to let employees experience EVs firsthand',
      actionPlan: 'Contact local EV dealers for on-site demonstration events',
      roi: '15% increase in EV uptake'
    },
    {
      id: 3,
      category: 'Incentives',
      title: 'Green Car Parking',
      impact: 'Medium',
      effort: 'Low',
      description: 'Reserve prime parking spots for EVs',
      actionPlan: 'Designate and mark premium parking spaces for EVs',
      roi: 'Low cost, high visibility initiative'
    },
    {
      id: 4,
      category: 'Policy',
      title: 'EV-First Policy',
      impact: 'High',
      effort: 'Low',
      description: 'Make EVs the default option for new leases',
      actionPlan: 'Update fleet policy to prioritize EVs in lease approvals',
      roi: '40% increase in EV selection'
    },
    {
      id: 5,
      category: 'Technology',
      title: 'Carbon Dashboard',
      impact: 'Medium',
      effort: 'Low',
      description: 'Show employees their carbon impact in real-time',
      actionPlan: 'Implement carbon tracking in employee dashboards',
      roi: 'Increased engagement and awareness'
    },
    {
      id: 6,
      category: 'Community',
      title: 'EV Champions Program',
      impact: 'High',
      effort: 'Medium',
      description: 'Create internal advocates for EV adoption',
      actionPlan: 'Select and train EV ambassadors across departments',
      roi: 'Peer influence drives 2x adoption rate'
    }
  ]);

  const [selectedTip, setSelectedTip] = useState(null);

  // Authentication
  const handleLogin = async (email, password, portal) => {
    try {
      let role = 'employee';
      if (email.includes('admin')) role = 'admin';
      else if (email.includes('dealer')) role = 'dealer';
      else if (email.includes('employer') || portal === 'mxdriveiq' && !email.includes('employee')) role = 'employer';
      
      const user = { id: 1, email, role };
      setUser(user);
      setCurrentPortal(portal);
      setUserRole(role);
      setActiveTab('dashboard');
      setCurrentView('main');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
    setCurrentPortal('mxdriveiq');
    setActiveTab('dashboard');
  };

  // Quick wins calculation
  const quickWins = evTips.filter(tip => 
    tip.impact === 'High' && (tip.effort === 'Low' || tip.effort === 'Medium')
  );

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Login Component
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MXDriveIQ</h1>
          <p className="text-gray-600">Integrated Novated Leasing Platform</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('admin@millarx.com', 'password', 'mxdriveiq')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Building2 size={20} />
            Access MXDriveIQ (Employer Portal)
          </button>
          
          <button
            onClick={() => handleLogin('employee@company.com', 'password', 'mxdriveiq')}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Users size={20} />
            Employee Dashboard
          </button>
          
          <button
            onClick={() => handleLogin('dealer@example.com', 'password', 'mxdealer')}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <UserCheck size={20} />
            Access MXDealerAdvantage
          </button>
          
          <button
            onClick={() => handleLogin('admin@millarx.com', 'password', 'admin')}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Shield size={20} />
            Admin Backend Access
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo Environment - Click any button to access</p>
        </div>
      </div>
    </div>
  );

  // Navigation Component
  const Navigation = () => {
    const getNavItems = () => {
      switch (currentPortal) {
        case 'mxdriveiq':
          if (userRole === 'employee') {
            return [
              { id: 'dashboard', label: 'My Dashboard', icon: BarChart3 },
              { id: 'calculator', label: 'Lease Calculator', icon: Calculator },
              { id: 'my-applications', label: 'My Applications', icon: FileText },
              { id: 'transport-log', label: 'Transport Log', icon: Car },
              { id: 'carbon-tracker', label: 'Carbon Tracker', icon: Leaf },
              { id: 'vehicle-entry', label: 'Register My Vehicles', icon: Database },
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
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  };

  // Employee Dashboard Components
  const EmployeeDashboard = () => {
    const calculateWeeklyAverage = (data, transport) => {
      const total = data.reduce((sum, day) => sum + day[transport], 0);
      return Math.round(total / data.length);
    };

    const currentReductionPercentage = Math.round(
      ((employeeData.personalEmissions.monthlyTotal - 200) / employeeData.personalEmissions.monthlyTotal) * 100
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="text-gray-600">Track your carbon footprint and make a difference</p>
          </div>
          <button
            onClick={() => setCurrentView('calculator')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate New Lease
          </button>
        </div>

        {/* Personal Impact Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Emissions</p>
                <p className="text-3xl font-bold text-gray-900">{employeeData.personalEmissions.monthlyTotal}</p>
                <p className="text-sm text-gray-500">kg CO2</p>
              </div>
              <Leaf className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Reduction This Month</p>
                <p className="text-3xl font-bold text-green-600">{currentReductionPercentage}%</p>
                <p className="text-sm text-gray-500">vs last month</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Achievements</p>
                <p className="text-3xl font-bold text-purple-600">
                  {employeeData.achievements.filter(a => a.earned).length}
                </p>
                <p className="text-sm text-gray-500">of {employeeData.achievements.length}</p>
              </div>
              <Award className="text-purple-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Goal Progress</p>
                <p className="text-3xl font-bold text-blue-600">{employeeData.goals.currentReduction}%</p>
                <p className="text-sm text-gray-500">of {employeeData.goals.reductionTarget}% target</p>
              </div>
              <Target className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Weekly Transport Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Weekly Transport Breakdown</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="text-red-500" size={20} />
                  <span>Car (avg daily km)</span>
                </div>
                <span className="font-semibold">{calculateWeeklyAverage(employeeData.weeklyLog, 'car')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    🚲
                  </div>
                  <span>Cycling (avg daily km)</span>
                </div>
                <span className="font-semibold text-green-600">{calculateWeeklyAverage(employeeData.weeklyLog, 'bike')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    🚶
                  </div>
                  <span>Walking (avg daily km)</span>
                </div>
                <span className="font-semibold text-blue-600">{calculateWeeklyAverage(employeeData.weeklyLog, 'walk')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    🚌
                  </div>
                  <span>Public Transport (avg daily km)</span>
                </div>
                <span className="font-semibold text-purple-600">{calculateWeeklyAverage(employeeData.weeklyLog, 'publicTransport')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Recent Achievements</h2>
            <div className="space-y-3">
              {employeeData.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Award size={16} />
                  </div>
                  <div>
                    <p className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </p>
                    {achievement.earned && achievement.date && (
                      <p className="text-sm text-gray-500">Earned {achievement.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab('transport-log')}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
            >
              <Car className="text-blue-600 mb-2" size={24} />
              <h3 className="font-medium">Log Today's Transport</h3>
              <p className="text-sm text-gray-600">Record your daily travel</p>
            </button>
            <button
              onClick={() => setActiveTab('vehicle-entry')}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
            >
              <Database className="text-purple-600 mb-2" size={24} />
              <h3 className="font-medium">Register Vehicles</h3>
              <p className="text-sm text-gray-600">Add your commuting vehicles</p>
            </button>
            <button
              onClick={() => setActiveTab('carbon-tracker')}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
            >
              <Leaf className="text-green-600 mb-2" size={24} />
              <h3 className="font-medium">View Carbon Impact</h3>
              <p className="text-sm text-gray-600">Track your emissions over time</p>
            </button>
            <button
              onClick={() => setCurrentView('calculator')}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
            >
              <Calculator className="text-purple-600 mb-2" size={24} />
              <h3 className="font-medium">Calculate EV Lease</h3>
              <p className="text-sm text-gray-600">See potential savings with an EV</p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TransportLogTab = () => {
    const handleLogTransport = () => {
      // Add to weekly log
      const newEntry = { ...transportLog };
      setEmployeeData(prev => ({
        ...prev,
        weeklyLog: [...prev.weeklyLog.slice(-4), newEntry]
      }));
      
      // Reset form
      setTransportLog({
        date: new Date().toISOString().split('T')[0],
        car: 0,
        bike: 0,
        walk: 0,
        publicTransport: 0
      });
      
      alert('Transport logged successfully!');
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Daily Transport Log</h1>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Log Today's Transport</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={transportLog.date}
                  onChange={(e) => setTransportLog(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚗 Car Travel (km)
                </label>
                <input
                  type="number"
                  value={transportLog.car}
                  onChange={(e) => setTransportLog(prev => ({ ...prev, car: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚲 Cycling (km)
                </label>
                <input
                  type="number"
                  value={transportLog.bike}
                  onChange={(e) => setTransportLog(prev => ({ ...prev, bike: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚶 Walking (km)
                </label>
                <input
                  type="number"
                  value={transportLog.walk}
                  onChange={(e) => setTransportLog(prev => ({ ...prev, walk: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚌 Public Transport (km)
                </label>
                <input
                  type="number"
                  value={transportLog.publicTransport}
                  onChange={(e) => setTransportLog(prev => ({ ...prev, publicTransport: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleLogTransport}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Log Transport
              </button>
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Date</th>
                  <th className="text-center py-2">🚗 Car</th>
                  <th className="text-center py-2">🚲 Bike</th>
                  <th className="text-center py-2">🚶 Walk</th>
                  <th className="text-center py-2">🚌 Transit</th>
                  <th className="text-center py-2">CO2 Impact</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.weeklyLog.map((entry, index) => {
                  const co2Impact = (entry.car * 0.21 - (entry.bike + entry.walk + entry.publicTransport) * 0.05).toFixed(1);
                  return (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2">{entry.date}</td>
                      <td className="text-center py-2">{entry.car} km</td>
                      <td className="text-center py-2 text-green-600">{entry.bike} km</td>
                      <td className="text-center py-2 text-blue-600">{entry.walk} km</td>
                      <td className="text-center py-2 text-purple-600">{entry.publicTransport} km</td>
                      <td className={`text-center py-2 ${co2Impact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {co2Impact} kg
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const CarbonTrackerTab = () => {
    const monthlyData = [
      { month: 'Jan', emissions: 280, target: 245 },
      { month: 'Feb', emissions: 265, target: 245 },
      { month: 'Mar', emissions: 250, target: 245 },
      { month: 'Apr', emissions: 235, target: 245 },
      { month: 'May', emissions: 220, target: 245 },
      { month: 'Jun', emissions: 210, target: 245 },
      { month: 'Jul', emissions: 205, target: 245 }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Carbon Footprint Tracker</h1>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Current Vehicle Impact</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicle Type</span>
                <span className="font-semibold">{employeeData.personalEmissions.vehicle.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly km</span>
                <span className="font-semibold">{employeeData.personalEmissions.vehicle.monthlyKm}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly CO2</span>
                <span className="font-semibold text-red-600">{employeeData.personalEmissions.vehicle.monthlyEmissions} kg</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Alternative Transport Impact</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">🚲 Cycling benefit</span>
                <span className="font-semibold text-green-600">-15 kg CO2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">🚶 Walking benefit</span>
                <span className="font-semibold text-green-600">-8 kg CO2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">🚌 Transit benefit</span>
                <span className="font-semibold text-green-600">-12 kg CO2</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Target Reduction</span>
                <span className="font-semibold">{employeeData.goals.reductionTarget}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Reduction</span>
                <span className="font-semibold text-green-600">{employeeData.goals.currentReduction}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(employeeData.goals.currentReduction / employeeData.goals.reductionTarget) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* EV Comparison */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
          <h2 className="text-lg font-semibold mb-4">🚗 Switch to Electric - See Your Impact!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">Current Monthly Emissions</h3>
              <p className="text-2xl font-bold text-red-600">245 kg CO2</p>
              <p className="text-sm text-gray-600">Petrol SUV</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">With Electric Vehicle</h3>
              <p className="text-2xl font-bold text-green-600">49 kg CO2</p>
              <p className="text-sm text-gray-600">80% reduction!</p>
            </div>
            <div className="bg-white p-4 rounded-lg flex items-center justify-center">
              <button
                onClick={() => setCurrentView('calculator')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Calculate EV Lease
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Monthly Emissions Trend</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="flex-1 flex flex-col justify-end mb-2">
                  <div 
                    className="bg-blue-500 w-full rounded-t"
                    style={{ height: `${(data.emissions / 300) * 200}px` }}
                  ></div>
                  <div 
                    className="bg-red-300 w-full border-t-2 border-red-500"
                    style={{ height: '2px', marginTop: `${200 - (data.target / 300) * 200}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Actual Emissions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-red-500 rounded"></div>
              <span>Target Line</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AchievementsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Achievements & Rewards</h1>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employeeData.achievements.map((achievement) => (
          <div 
            key={achievement.id} 
            className={`p-6 rounded-xl border-2 ${
              achievement.earned 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                achievement.earned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <Award size={24} />
              </div>
              <div>
                <h3 className={`font-semibold ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                  {achievement.title}
                </h3>
                {achievement.earned && achievement.date && (
                  <p className="text-sm text-gray-600">Earned {achievement.date}</p>
                )}
              </div>
            </div>
            
            {achievement.earned ? (
              <div className="bg-yellow-100 p-3 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">🎉 Achievement Unlocked!</p>
              </div>
            ) : (
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Keep going to unlock this achievement!</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const VehicleEntryForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [showSuccessOptions, setShowSuccessOptions] = useState(false);
    const [submittedVehicles, setSubmittedVehicles] = useState([]);
    const totalSteps = 3;

    // Form State
    const [form, setForm] = useState({
      employeeId: user?.email || "",
      vehicleType: "",
      fuelType: "Petrol",
      kmPerYear: 15000,
      fuelEfficiency: 7.5,
      businessUse: 0,
      hasNovated: false
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
      setIsSubmitting(true);

      const record = {
        ...form,
        kmPerYear: +form.kmPerYear,
        fuelEfficiency: +form.fuelEfficiency,
        businessUse: +form.businessUse,
        hasNovated: form.hasNovated
      };

      try {
        // Simulate API call to Supabase
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Submitting vehicle data:", record);
        
        // Add to submitted vehicles list
        setSubmittedVehicles(prev => [...prev, {
          vehicleType: form.vehicleType,
          fuelType: form.fuelType,
          kmPerYear: form.kmPerYear,
          fuelEfficiency: form.fuelEfficiency
        }]);
        
        // Update employee's vehicle data in state
        setEmployeeData(prev => ({
          ...prev,
          personalEmissions: {
            ...prev.personalEmissions,
            vehicle: {
              type: form.vehicleType,
              fuelType: form.fuelType,
              monthlyKm: Math.round(form.kmPerYear / 12),
              monthlyEmissions: calculateVehicleEmissions(form)
            }
          }
        }));
        
        setShowSuccessOptions(true);
        
      } catch (err) {
        console.error(err);
        alert("Submission failed: " + err.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    const calculateVehicleEmissions = (vehicleData) => {
      const emissionFactors = {
        'Petrol': 2.3,
        'Diesel': 2.7,
        'Hybrid': 1.15,
        'EV': 0.1
      };
      
      const factor = emissionFactors[vehicleData.fuelType] || 2.3;
      const monthlyKm = vehicleData.kmPerYear / 12;
      const monthlyFuelConsumption = (monthlyKm * vehicleData.fuelEfficiency) / 100;
      
      if (vehicleData.fuelType === 'EV') {
        return monthlyFuelConsumption * 0.5; // kWh to CO2 conversion
      }
      
      return monthlyFuelConsumption * factor;
    };

    const handleAddAnotherVehicle = () => {
      setForm({
        employeeId: user?.email || "",
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

    const handleFinishAndReturn = () => {
      setShowSuccessOptions(false);
      setActiveTab('dashboard');
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

    // Check if user has any non-EV vehicles
    const hasNonEVVehicles = submittedVehicles.some(vehicle => vehicle.fuelType !== 'EV');

    // Calculate potential carbon savings by switching to EV
    const calculateCarbonSavings = () => {
      const nonEVVehicles = submittedVehicles.filter(vehicle => vehicle.fuelType !== 'EV');
      let totalSavings = 0;

      nonEVVehicles.forEach(vehicle => {
        const emissionFactors = {
          'Petrol': 2.3,
          'Diesel': 2.7,
          'Hybrid': 1.15
        };

        const factor = emissionFactors[vehicle.fuelType] || 2.3;
        const annualFuelConsumption = (vehicle.kmPerYear * vehicle.fuelEfficiency) / 100;
        const annualEmissions = annualFuelConsumption * factor;
        
        const evEmissions = 0.1;
        const savings = Math.max(0, (annualEmissions / 1000) - evEmissions);
        totalSavings += savings;
      });

      return totalSavings.toFixed(1);
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Register My Vehicles</h1>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Progress Indicator */}
        {!showSuccessOptions && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Vehicle Information for Scope 3 Reporting</h2>
              <span className="text-sm text-gray-600">Step {step} of {totalSteps}</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    stepNum === step 
                      ? 'bg-blue-600 text-white' 
                      : stepNum < step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum < step ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < 3 && <div className={`flex-1 h-1 rounded ${stepNum < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>
            
            <p className="text-gray-600 font-medium">{getStepTitle(step)}</p>
          </div>
        )}

        {/* Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {showSuccessOptions ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Registered Successfully!</h3>
                <p className="text-gray-600">
                  Your vehicle information has been recorded for emissions tracking. Do you have any other vehicles used for commuting?
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Just registered:</p>
                <p className="font-semibold text-gray-900">{form.vehicleType}</p>
                <p className="text-sm text-gray-500">{form.fuelType} • {form.kmPerYear.toLocaleString()} km/year</p>
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
                      <Leaf className="text-green-600 mr-2" size={24} />
                      <span className="font-bold text-green-800 text-lg">
                        You could save {calculateCarbonSavings()} tonnes of CO₂ emissions per year
                      </span>
                    </div>
                    <p className="text-green-700 text-sm text-center">
                      by switching to an electric vehicle through our novated lease program
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setCurrentView('calculator')}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Calculator size={20} />
                      <span>Calculate Your EV Savings Now</span>
                    </div>
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleAddAnotherVehicle}
                  className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Plus size={20} />
                    <span>Add Another Vehicle</span>
                  </div>
                </button>

                <button
                  onClick={handleFinishAndReturn}
                  className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Return to Dashboard</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Employee ID or Email
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={form.employeeId}
                      onChange={handleChange}
                      placeholder="e.g., john.doe@company.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Vehicle Type
                    </label>
                    <input
                      type="text"
                      name="vehicleType"
                      value={form.vehicleType}
                      onChange={handleChange}
                      placeholder="e.g., Toyota Corolla Hybrid, BMW X3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    Continue to Vehicle Details
                  </button>
                </div>
              )}

              {/* Step 2: Vehicle Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{fuel.icon}</div>
                          <div className="font-medium text-gray-700">{fuel.value}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">km/year</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        {form.fuelType === "EV" ? "kWh/100km" : "L/100km"}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                      className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Did you claim business use for this car on your tax return?
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="hasBusiness"
                          value="no"
                          checked={form.businessUse === 0}
                          onChange={() => setForm(prev => ({ ...prev, businessUse: 0 }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">No, personal use only</span>
                      </label>
                      <label className="flex items-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="hasBusiness"
                          value="yes"
                          checked={form.businessUse !== 0}
                          onChange={() => setForm(prev => ({ ...prev, businessUse: 50 }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">Yes, I claimed business use</span>
                      </label>
                    </div>

                    {form.businessUse !== 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white"
                            placeholder="Enter business use %"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Is this car on a novated lease?
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="hasNovated"
                          value="no"
                          checked={!form.hasNovated}
                          onChange={() => setForm(prev => ({ ...prev, hasNovated: false }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">No</span>
                      </label>
                      <label className="flex items-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="hasNovated"
                          value="yes"
                          checked={form.hasNovated}
                          onChange={() => setForm(prev => ({ ...prev, hasNovated: true }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">Yes</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none relative"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Submitting...
                        </div>
                      ) : (
                        "Register Vehicle"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Card */}
        {step > 1 && !showSuccessOptions && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
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
      </div>
    );
  };

  const MXDriveIQDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Download Report
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Active Leases</p>
              <p className="text-3xl font-bold text-gray-900">{leaseData.totalLeases}</p>
            </div>
            <Car className="text-blue-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">EV Leases</p>
              <p className="text-3xl font-bold text-green-600">{leaseData.evLeases}</p>
              <p className="text-sm text-gray-500">{Math.round((leaseData.evLeases / leaseData.totalLeases) * 100)}% of total</p>
            </div>
            <Leaf className="text-green-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Carbon Saved (tonnes)</p>
              <p className="text-3xl font-bold text-green-600">{leaseData.carbonSaved}</p>
            </div>
            <Globe className="text-green-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Annual Savings</p>
              <p className="text-3xl font-bold text-blue-600">${leaseData.costSavings.toLocaleString()}</p>
            </div>
            <DollarSign className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      {/* EV Uptake and Grey Fleet Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grey Fleet Data Capture */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Grey Fleet Data Capture</h2>
            <Database className="text-purple-600" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Employees with registered vehicles</span>
              <span className="font-semibold">127 of 203</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Data completion rate</span>
              <span className="font-semibold text-yellow-600">63%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '63%' }}></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Share Employee Portal
              </button>
              <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                Download Data
              </button>
            </div>
          </div>
        </div>

        {/* Quick Wins for EV Uptake */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-green-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Quick Win Ready</h2>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
            <h3 className="font-semibold text-gray-900 mb-1">🚗 Green Car Parking</h3>
            <p className="text-sm text-gray-600 mb-2">Reserve prime parking spots for EVs - Low effort, Medium impact</p>
            <div className="flex gap-1">
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">Medium Impact</span>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">Low Effort</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('ev-tips')}
            className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All EV Uptake Tips →
          </button>
        </div>
      </div>

      {/* Previous Quick Wins Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-green-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Additional Quick Wins for EV Uptake</h2>
        </div>
        <p className="text-gray-700 mb-4">
          High-impact, low-effort actions to boost your EV adoption rate:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickWins.slice(0, 4).map((tip) => (
            <div key={tip.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                <div className="flex gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(tip.impact)}`}>
                    {tip.impact} Impact
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getEffortColor(tip.effort)}`}>
                    {tip.effort} Effort
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{tip.description}</p>
              <button
                onClick={() => setSelectedTip(tip)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Action Plan →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EVTipsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">EV Uptake Tips & Strategies</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Request Consultation
        </button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Infrastructure', 'Education', 'Incentives', 'Policy', 'Technology', 'Community'].map((category) => {
          const categoryTips = evTips.filter(tip => tip.category === category);
          return (
            <div key={category} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
              <div className="space-y-3">
                {categoryTips.map((tip) => (
                  <div key={tip.id} className="border-l-4 border-blue-200 pl-3">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{tip.title}</h4>
                      <div className="flex gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${getImpactColor(tip.impact)}`}>
                          {tip.impact.charAt(0)}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${getEffortColor(tip.effort)}`}>
                          {tip.effort.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs mb-2">{tip.description}</p>
                    <button
                      onClick={() => setSelectedTip(tip)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const LeaseCalculator = () => {
    const [vehiclePrice, setVehiclePrice] = useState(50000);
    const [term, setTerm] = useState(36);
    const [salary, setSalary] = useState(80000);
    const [vehicleType, setVehicleType] = useState('electric');
    
    const calculateLease = () => {
      const baseRate = vehicleType === 'electric' ? 0.018 : 0.02;
      const monthlyPayment = (vehiclePrice * baseRate).toFixed(2);
      const taxSavings = (monthlyPayment * 0.32).toFixed(2);
      const netCost = (monthlyPayment - taxSavings).toFixed(2);
      const carbonSavings = vehicleType === 'electric' ? 2.8 : 0;
      
      return { monthlyPayment, taxSavings, netCost, carbonSavings };
    };
    
    const results = calculateLease();
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Self-Serve Lease Calculator</h1>
          {userRole === 'employee' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Vehicle & Personal Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="electric">Electric Vehicle</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Price</label>
                <input
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lease Term (months)</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={24}>24 months</option>
                  <option value={36}>36 months</option>
                  <option value={48}>48 months</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Lease Breakdown</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Monthly Lease Payment</span>
                <span className="font-semibold">${results.monthlyPayment}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Tax Savings</span>
                <span className="font-semibold text-green-600">-${results.taxSavings}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 text-lg font-bold">
                <span>Net Monthly Cost</span>
                <span className="text-blue-600">${results.netCost}</span>
              </div>

              {vehicleType === 'electric' && (
                <div className="bg-green-50 p-4 rounded-lg mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="text-green-600" size={20} />
                    <span className="font-semibold text-green-800">Environmental Impact</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Save {results.carbonSavings} tonnes CO2 per year vs petrol equivalent
                  </p>
                </div>
              )}
              
              <button 
                onClick={() => setCurrentView('application')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6"
              >
                Apply for This Lease
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LeaseApplicationForm = () => {
    const [applicationData, setApplicationData] = useState({
      personalDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
      },
      employmentDetails: {
        employer: '',
        position: '',
        annualSalary: 80000,
        employmentType: 'full-time'
      },
      vehicleDetails: {
        make: '',
        model: '',
        year: 2024,
        price: 50000,
        dealer: ''
      },
      leaseDetails: {
        term: 36,
        monthlyPayment: 900,
        taxSavings: 288,
        netCost: 612
      }
    });

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const handleSubmit = () => {
      alert('Application submitted successfully! You will receive a confirmation email shortly.');
      setCurrentView('main');
      setActiveTab('my-applications');
    };

    const renderStep = () => {
      switch (currentStep) {
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
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      personalDetails: { ...prev.personalDetails, firstName: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={applicationData.personalDetails.lastName}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      personalDetails: { ...prev.personalDetails, lastName: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={applicationData.personalDetails.email}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      personalDetails: { ...prev.personalDetails, email: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={applicationData.personalDetails.phone}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      personalDetails: { ...prev.personalDetails, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employer</label>
                  <input
                    type="text"
                    value={applicationData.employmentDetails.employer}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      employmentDetails: { ...prev.employmentDetails, employer: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={applicationData.employmentDetails.position}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      employmentDetails: { ...prev.employmentDetails, position: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary</label>
                  <input
                    type="number"
                    value={applicationData.employmentDetails.annualSalary}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      employmentDetails: { ...prev.employmentDetails, annualSalary: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <select
                    value={applicationData.employmentDetails.employmentType}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      employmentDetails: { ...prev.employmentDetails, employmentType: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  <input
                    type="text"
                    value={applicationData.vehicleDetails.make}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      vehicleDetails: { ...prev.vehicleDetails, make: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={applicationData.vehicleDetails.model}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      vehicleDetails: { ...prev.vehicleDetails, model: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={applicationData.vehicleDetails.year}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      vehicleDetails: { ...prev.vehicleDetails, year: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={applicationData.vehicleDetails.price}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      vehicleDetails: { ...prev.vehicleDetails, price: Number(e.target.value) }
                    }))}
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
                  <div className="flex justify-between font-bold">
                    <span>Net Monthly Cost:</span>
                    <span>${applicationData.leaseDetails.netCost}</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Lease Application</h1>
          <button
            onClick={() => setCurrentView('calculator')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Calculator
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep === totalSteps ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Application
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          )}
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

  // Dealer Portal Components
  const DealerDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dealer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Active Quotes</h3>
          <p className="text-3xl font-bold text-blue-600">34</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Conversions This Month</h3>
          <p className="text-3xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">$245K</p>
        </div>
      </div>
    </div>
  );

  // Admin Portal Components
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

  // Modal Component for EV Tips
  const TipModal = ({ tip, onClose }) => {
    if (!tip) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900">{tip.title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(tip.impact)}`}>
                {tip.impact} Impact
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${getEffortColor(tip.effort)}`}>
                {tip.effort} Effort
              </span>
            </div>
            <p className="text-gray-600">{tip.description}</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Action Plan:</h4>
              <p className="text-blue-800 text-sm">{tip.actionPlan}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Expected ROI:</h4>
              <p className="text-green-800 text-sm">{tip.roi}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1">
              Request Support
            </button>
            <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  const renderContent = () => {
    // Handle view navigation for calculator and application flows
    if (currentView === 'calculator') {
      return <LeaseCalculator />;
    }
    if (currentView === 'application') {
      return <LeaseApplicationForm />;
    }

    // Main content based on portal and active tab
    if (currentPortal === 'mxdriveiq') {
      if (userRole === 'employee') {
        switch (activeTab) {
          case 'dashboard': return <EmployeeDashboard />;
          case 'calculator': return <LeaseCalculator />;
          case 'transport-log': return <TransportLogTab />;
          case 'carbon-tracker': return <CarbonTrackerTab />;
          case 'achievements': return <AchievementsTab />;
          case 'vehicle-entry': return <VehicleEntryForm />;
          case 'my-applications': return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                <button
                  onClick={() => setCurrentView('calculator')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Application
                </button>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center py-12">
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No applications yet. Start by calculating a lease!</p>
              </div>
            </div>
          );
          default: return <div className="text-center py-12 text-gray-500">Content coming soon...</div>;
        }
      } else {
        // Employer view
        switch (activeTab) {
          case 'dashboard': return <MXDriveIQDashboard />;
          case 'calculator': return <LeaseCalculator />;
          case 'ev-tips': return <EVTipsTab />;
          case 'emissions': return <EmissionsReporting />;
          default: return <div className="text-center py-12 text-gray-500">Content coming soon...</div>;
        }
      }
    } else if (currentPortal === 'mxdealer') {
      switch (activeTab) {
        case 'dashboard': return <DealerDashboard />;
        default: return <div className="text-center py-12 text-gray-500">Dealer content coming soon...</div>;
      }
    } else if (currentPortal === 'admin') {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard />;
        default: return <div className="text-center py-12 text-gray-500">Admin content coming soon...</div>;
      }
    }
    
    return <div className="text-center py-12 text-gray-500">Content not found</div>;
  };

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 hidden md:block">
        <Navigation />
      </div>
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 md:hidden">
          <Navigation />
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      <TipModal tip={selectedTip} onClose={() => setSelectedTip(null)} />
    </div>
  );
};

export default NovatedLeasingPlatform;