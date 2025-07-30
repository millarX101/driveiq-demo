import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Users, 
  BarChart3, 
  Settings, 
  FileText, 
  Leaf, 
  TrendingUp, 
  DollarSign,
  Shield,
  Download,
  Plus,
  Eye,
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
  Bike,
  Train,
  MapPin,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Home,
  Battery,
  ExternalLink,
  Calendar,
  Mail
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from 'recharts';
import { supabase } from '../supabaseClient';

const RefinedMXDriveIQPlatform = () => {
  const [currentPortal, setCurrentPortal] = useState('mxdriveiq');
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [showJetchargeModal, setShowJetchargeModal] = useState(false);
  const [greyFleetData, setGreyFleetData] = useState(null);

  // Check for existing session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // For demo purposes, set role based on email
        const role = session.user.email.includes('admin') ? 'admin' : 'employee';
        setUserRole(role);
        await loadCompanyData();
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  // Authentication with Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google login error:', error);
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Authentication (for demo)
  const handleEmailLogin = async (email, password, portal) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      if (error) throw error;
      
      setUser(data.user);
      // For demo purposes, set role based on email
      const role = email.includes('admin') ? 'admin' : 'employee';
      setUserRole(role);
      setCurrentPortal(portal);
      setActiveTab('dashboard');
      
      await loadCompanyData();
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      setCompanyData(null);
      setGreyFleetData(null);
      setCurrentPortal('mxdriveiq');
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Load company data from Supabase
  const loadCompanyData = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', 'demo-company-123')
        .single();
      
      if (error) throw error;
      setCompanyData(data);
    } catch (error) {
      console.error('Error loading company data:', error);
    }
  };

  // Data loading effects
  useEffect(() => {
    if (user && activeTab === 'commuting-fleet') {
      loadCommutingFleetData();
    }
  }, [user, activeTab]);

  const loadCommutingFleetData = async () => {
    try {
      const { data, error } = await supabase
        .from('transport_logs')
        .select(`
          *,
          employees (
            name,
            department,
            primary_transport
          )
        `)
        .order('log_date', { ascending: false })
        .limit(1000);
      
      if (error) throw error;
      setGreyFleetData(data);
    } catch (error) {
      console.error('Error loading commuting data:', error);
    }
  };

  // Login Screen
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MXDriveIQ</h1>
          <p className="text-gray-600">Integrated Novated Leasing Platform</p>
        </div>
        
        <div className="space-y-4">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or use demo accounts</span>
            </div>
          </div>
          
          {/* Demo Login Buttons */}
          <button
            onClick={() => handleEmailLogin('admin@millarx.com', 'password', 'mxdriveiq')}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Building2 size={20} />
            Access MXDriveIQ (Employer Portal)
          </button>
          
          <button
            onClick={() => handleEmailLogin('employee@company.com', 'password', 'mxdriveiq')}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Users size={20} />
            Employee Dashboard
          </button>
          
          <button
            onClick={() => handleEmailLogin('dealer@example.com', 'password', 'mxdealer')}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserCheck size={20} />
            Access MXDealerAdvantage
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo Environment - Connected to Supabase</p>
          <p className="mt-1">Google Auth configured for live testing</p>
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
              { id: 'transport-log', label: 'Transport Log', icon: Car },
              { id: 'carbon-tracker', label: 'Carbon Tracker', icon: Leaf },
              { id: 'achievements', label: 'Achievements', icon: Award }
            ];
          } else {
            return [
              { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
              { id: 'commuting-fleet', label: 'Commuting Fleet', icon: Users },
              { id: 'company-benefits', label: 'Company Benefits', icon: DollarSign },
              { id: 'emissions', label: 'Emissions Reporting', icon: Leaf },
              { id: 'ev-tips', label: 'EV Uptake Tips', icon: Zap },
              { id: 'carbon-credits', label: 'Carbon Credits', icon: Globe }
            ];
          }
        case 'mxdealer':
          return [
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'quotes', label: 'Quotes', icon: DollarSign },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'metrics', label: 'Metrics', icon: TrendingUp }
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
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  };

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentPortal === 'mxdriveiq' && userRole === 'employee' && 'Employee Dashboard'}
            {currentPortal === 'mxdriveiq' && userRole !== 'employee' && 'Employer Dashboard'}
            {currentPortal === 'mxdealer' && 'Dealer Portal'}
          </h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          {companyData && (
            <div className="text-right">
              <p className="text-sm text-gray-600">{companyData.name}</p>
              <p className="text-xs text-gray-500">{companyData.employee_count} employees</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  // Employer Dashboard Components
  const EmployerDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Car className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Total Leases</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{companyData?.total_leases || 156}</p>
          <p className="text-sm text-gray-500 mt-1">Active novated leases</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">EV Adoption</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{companyData?.ev_leases || 89}</p>
          <p className="text-sm text-gray-500 mt-1">57% of total fleet</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Carbon Saved</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{companyData?.carbon_saved || 45.6}t</p>
          <p className="text-sm text-gray-500 mt-1">CO₂ annually</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Grey Fleet Data</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{companyData?.grey_fleet_completion || 73}%</p>
          <p className="text-sm text-gray-500 mt-1">Completion rate</p>
        </div>
      </div>

      {/* Grey Fleet Policy Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Grey Fleet Policy Recommendations</h3>
            <div className="space-y-2 text-sm text-yellow-700">
              <p>• Consider implementing a formal grey fleet policy for vehicles over 15,000km annually</p>
              <p>• 27% of employees haven't submitted vehicle data - compliance risk for Scope 3 reporting</p>
              <p>• Review duty of care obligations for high-mileage business use vehicles</p>
            </div>
            <button className="mt-3 text-yellow-800 underline text-sm hover:text-yellow-900">
              View Policy Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // NEW: Commuting Fleet Dashboard
  const CommutingFleetDashboard = () => {
    const [transportStats, setTransportStats] = useState(null);
    const [weeklyData, setWeeklyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (greyFleetData) {
        processTransportData();
      }
    }, [greyFleetData]);

    const processTransportData = () => {
      if (!greyFleetData || greyFleetData.length === 0) return;

      // Process transport method distribution
      const methodCounts = {};
      const methodEmissions = {};
      let totalEmissions = 0;
      let totalCost = 0;

      greyFleetData.forEach(log => {
        const method = log.transport_method;
        methodCounts[method] = (methodCounts[method] || 0) + 1;
        methodEmissions[method] = (methodEmissions[method] || 0) + (log.emissions_kg || 0);
        totalEmissions += log.emissions_kg || 0;
        totalCost += log.cost_aud || 0;
      });

      // Create transport methods array for pie chart
      const transportMethods = Object.entries(methodCounts).map(([method, count]) => ({
        name: method,
        value: count,
        color: getTransportColor(method),
        emissions: getEmissionLevel(method)
      }));

      // Process weekly trends
      const weeklyTrends = processWeeklyTrends(greyFleetData);

      setTransportStats({
        methods: transportMethods,
        totalVehicles: Object.values(methodCounts).reduce((a, b) => a + b, 0),
        sustainableCount: getSustainableCount(methodCounts),
        totalEmissions: (totalEmissions / 1000).toFixed(1), // Convert to tonnes
        totalCost: totalCost.toFixed(0)
      });

      setWeeklyData(weeklyTrends);
      setLoading(false);
    };

    const getTransportColor = (method) => {
      const colors = {
        'EV': '#10b981',
        'Hybrid': '#10b981',
        'Petrol Car': '#f59e0b',
        'Diesel Car': '#ef4444',
        'Public Transport': '#3b82f6',
        'Cycling': '#06b6d4',
        'Walking': '#8b5cf6'
      };
      return colors[method] || '#6b7280';
    };

    const getEmissionLevel = (method) => {
      const levels = {
        'EV': 'Zero',
        'Hybrid': 'Low',
        'Petrol Car': 'High',
        'Diesel Car': 'High',
        'Public Transport': 'Low',
        'Cycling': 'Zero',
        'Walking': 'Zero'
      };
      return levels[method] || 'Medium';
    };

    const getSustainableCount = (methodCounts) => {
      const sustainable = ['EV', 'Hybrid', 'Public Transport', 'Cycling', 'Walking'];
      return sustainable.reduce((total, method) => total + (methodCounts[method] || 0), 0);
    };

    const processWeeklyTrends = (data) => {
      const weeks = {};
      
      data.forEach(log => {
        const date = new Date(log.log_date);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeks[weekKey]) {
          weeks[weekKey] = { ev: 0, petrol: 0, public: 0, cycling: 0 };
        }
        
        const method = log.transport_method;
        if (method === 'EV' || method === 'Hybrid') weeks[weekKey].ev++;
        else if (method === 'Petrol Car' || method === 'Diesel Car') weeks[weekKey].petrol++;
        else if (method === 'Public Transport') weeks[weekKey].public++;
        else if (method === 'Cycling') weeks[weekKey].cycling++;
      });

      return Object.entries(weeks)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .slice(-4)
        .map(([date, counts], index) => ({
          week: `Week ${index + 1}`,
          ...counts
        }));
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading transport data...</div>
        </div>
      );
    }

    const transportMethods = transportStats?.methods || [];
    const weeklyTrends = weeklyData || [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Commuting Fleet Analytics</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Data
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Total Commute Logs</h3>
            <p className="text-3xl font-bold text-blue-600">{transportStats?.totalVehicles || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Sustainable Options</h3>
            <p className="text-3xl font-bold text-green-600">{transportStats?.sustainableCount || 0}</p>
            <p className="text-sm text-gray-500 mt-1">EV, Hybrid, Public, Cycling</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Monthly Emissions</h3>
            <p className="text-3xl font-bold text-red-600">{transportStats?.totalEmissions || 0}t</p>
            <p className="text-sm text-gray-500 mt-1">CO₂ from commuting</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Monthly Cost</h3>
            <p className="text-3xl font-bold text-purple-600">${transportStats?.totalCost || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Fuel & transport costs</p>
          </div>
        </div>

        {/* Transport Method Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transport Method Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transportMethods}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {transportMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ev" stroke="#10b981" name="EV/Hybrid" strokeWidth={2} />
                <Line type="monotone" dataKey="petrol" stroke="#f59e0b" name="Petrol/Diesel" strokeWidth={2} />
                <Line type="monotone" dataKey="public" stroke="#3b82f6" name="Public Transport" strokeWidth={2} />
                <Line type="monotone" dataKey="cycling" stroke="#06b6d4" name="Cycling" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Key Insights & Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">Wins</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 23% EV adoption rate (industry avg: 15%)</li>
                <li>• 12% emissions reduction this quarter</li>
                <li>• High engagement in cycling initiatives</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-700 mb-2">Opportunities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 132 petrol vehicles could switch to EV</li>
                <li>• Increase public transport incentives</li>
                <li>• Expand bike parking facilities</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">Next Steps</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Partner with Jetcharge for home charging</li>
                <li>• Launch EV test drive program</li>
                <li>• Implement cycling rewards system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // NEW: Company Benefits Page
  const CompanyBenefitsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Company Financial Benefits</h2>
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium">
          Estimates Only
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800 mb-2">Important Disclaimer</h3>
            <p className="text-sm text-red-700">
              These figures are estimates only and should not be relied upon for financial planning. 
              Actual savings depend on individual circumstances, salary packaging arrangements, and current tax legislation. 
              Please consult your tax advisor or financial planner for personalized advice.
            </p>
          </div>
        </div>
      </div>

      {/* Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Payroll Tax Savings</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">$47,800</p>
          <p className="text-sm text-gray-500 mt-1">Annual estimated savings</p>
          <div className="mt-3 text-xs text-gray-400">
            Based on 5% payroll tax rate × pre-tax deductions
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Super Guarantee Savings</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">$109,980</p>
          <p className="text-sm text-gray-500 mt-1">Annual estimated savings</p>
          <div className="mt-3 text-xs text-gray-400">
            Based on 11.5% SG rate × pre-tax deductions
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Total Annual Benefit</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">$157,780</p>
          <p className="text-sm text-gray-500 mt-1">Combined savings estimate</p>
          <div className="mt-3 text-xs text-gray-400">
            Excluding admin fees and other costs
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Detailed Savings Breakdown</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Monthly Value</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Annual Saving</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Rate Applied</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Vehicle Leases (156 active)</td>
                  <td className="text-right py-3 px-4">$79,500</td>
                  <td className="text-right py-3 px-4 text-green-600 font-semibold">$47,700</td>
                  <td className="text-right py-3 px-4">5.0% Payroll Tax</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Super Guarantee Savings</td>
                  <td className="text-right py-3 px-4">$79,500</td>
                  <td className="text-right py-3 px-4 text-blue-600 font-semibold">$109,980</td>
                  <td className="text-right py-3 px-4">11.5% SG Rate</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Workers Comp Reduction</td>
                  <td className="text-right py-3 px-4">$79,500</td>
                  <td className="text-right py-3 px-4 text-purple-600 font-semibold">$1,590</td>
                  <td className="text-right py-3 px-4">~2.0% avg rate</td>
                </tr>
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4">Total Estimated Savings</td>
                  <td className="text-right py-3 px-4">-</td>
                  <td className="text-right py-3 px-4 text-green-600">$159,270</td>
                  <td className="text-right py-3 px-4">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Considerations */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">Additional Considerations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">Factors that may increase savings:</h4>
            <ul className="space-y-1">
              <li>• Higher state payroll tax rates</li>
              <li>• Additional FBT exemptions for EVs</li>
              <li>• Increased participation rates</li>
              <li>• Premium vehicle selections</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Factors that may reduce savings:</h4>
            <ul className="space-y-1">
              <li>• Administration and setup costs</li>
              <li>• Lower participation than projected</li>
              <li>• Changes to tax legislation</li>
              <li>• State-specific variations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Employee Dashboard Components
  const EmployeeDashboard = () => {
    const hasEV = true; // Check user's vehicle data

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">My Carbon Footprint</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">2.4t</p>
            <p className="text-sm text-gray-500 mt-1">CO₂ this year</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Achievements</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">7</p>
            <p className="text-sm text-gray-500 mt-1">Earned this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Goal Progress</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">78%</p>
            <p className="text-sm text-gray-500 mt-1">Towards 20% reduction</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://www.mxdealeradvantage.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <DollarSign className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900">Calculate My Lease</h4>
                <p className="text-sm text-blue-700">Get personalized quotes & scenarios</p>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-600" />
            </a>
            
            {hasEV && (
              <button
                onClick={() => setShowJetchargeModal(true)}
                className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
              >
                <Home className="w-6 h-6 text-green-600" />
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-green-900">Home Charging Setup</h4>
                  <p className="text-sm text-green-700">Install EV charger with Jetcharge</p>
                </div>
                <Battery className="w-4 h-4 text-green-600" />
              </button>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Bike className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Cycled to work</p>
                <p className="text-xs text-gray-500">Today • Saved 2.1kg CO₂</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Car className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">EV commute logged</p>
                <p className="text-xs text-gray-500">Yesterday • 45km</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Train className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Public transport day</p>
                <p className="text-xs text-gray-500">Friday • Saved 8.4kg CO₂</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Jetcharge Modal Component
  const JetchargeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Home EV Charging Setup</h3>
          <button
            onClick={() => setShowJetchargeModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Battery className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Jetcharge Installation</h4>
              <p className="text-sm text-gray-600">Professional EV charging solutions</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Free site assessment and quote</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Professional installation by certified electricians</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Smart charging technology with app control</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Warranty and ongoing support</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Calendar size={18} />
            Book Free Assessment
          </button>
          <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Mail size={18} />
            Send Me Information
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Powered by Jetcharge - Australia's leading EV charging network
        </p>
      </div>
    </div>
  );

  // Main render function
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <Navigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          {currentPortal === 'mxdriveiq' && userRole !== 'employee' && (
            <>
              {activeTab === 'dashboard' && <EmployerDashboard />}
              {activeTab === 'commuting-fleet' && <CommutingFleetDashboard />}
              {activeTab === 'company-benefits' && <CompanyBenefitsPage />}
            </>
          )}
          
          {currentPortal === 'mxdriveiq' && userRole === 'employee' && (
            <EmployeeDashboard />
          )}
          
          {currentPortal === 'mxdealer' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MXDealerAdvantage Portal</h2>
              <p className="text-gray-600">Dealer functionality coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showJetchargeModal && <JetchargeModal />}
    </div>
  );
};

export default RefinedMXDriveIQPlatform;
