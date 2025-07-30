import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Car, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  FileText, 
  BarChart3, 
  Leaf, 
  Calculator, 
  UserPlus, 
  Download, 
  Eye,
  Edit,
  Plus,
  Search,
  Bell,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  Building,
  Activity
} from 'lucide-react';

const MXIntegratedPlatform = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [platformMode, setPlatformMode] = useState('driveiq');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  // Real data from Supabase
  const [dashboardData, setDashboardData] = useState({
    totalQuotes: 0,
    activeLeases: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    evUptake: 0,
    carbonSaved: 0,
    scope2Emissions: 850,
    scope3Emissions: 1200
  });

  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [rates, setRates] = useState([]);

  // Lease Calculator State
  const [leaseForm, setLeaseForm] = useState({
    vehiclePrice: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '2024',
    fuelType: 'electric',
    salary: '',
    taxBracket: '32.5',
    leaseTerm: '36',
    fullName: '',
    email: '',
    phone: '',
    employer: ''
  });

  const [calculationResult, setCalculationResult] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
    loadUsers();
    loadApplications();
    loadQuotes();
    loadRates();
    loadNotifications();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load quotes data
      const { data: quotesData, error: quotesError } = await supabase
        .from('active_quotes_view')
        .select('*');

      if (quotesError) throw quotesError;

      // Load applications data
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('pending_applications_view')
        .select('*');

      if (applicationsError) throw applicationsError;

      // Calculate metrics from real data
      const totalQuotes = quotesData?.length || 0;
      const approvedQuotes = quotesData?.filter(q => q.status === 'approved').length || 0;
      const conversionRate = totalQuotes > 0 ? Math.round((approvedQuotes / totalQuotes) * 100) : 0;
      
      // Estimate revenue from approved quotes
      const monthlyRevenue = quotesData?.reduce((sum, quote) => {
        if (quote.status === 'approved' && quote.financial_data?.monthly_payment) {
          return sum + quote.financial_data.monthly_payment;
        }
        return sum;
      }, 0) || 0;

      // Calculate EV uptake
      const evQuotes = quotesData?.filter(q => 
        q.vehicle_data?.fuelType === 'electric' || 
        q.vehicle_data?.fuel_type === 'electric'
      ).length || 0;
      const evUptake = totalQuotes > 0 ? Math.round((evQuotes / totalQuotes) * 100) : 0;

      // Estimate carbon saved (simplified calculation)
      const carbonSaved = evQuotes * 2500; // Assume 2.5 tonnes CO2 saved per EV per year

      setDashboardData({
        totalQuotes,
        activeLeases: approvedQuotes,
        monthlyRevenue: Math.round(monthlyRevenue),
        conversionRate,
        evUptake,
        carbonSaved,
        scope2Emissions: 850,
        scope3Emissions: 1200
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match expected format
      const transformedUsers = data?.map(user => ({
        id: user.id,
        name: user.full_name || 'Unknown User',
        email: user.email || '',
        role: user.role || 'employee',
        status: user.is_active ? 'active' : 'inactive',
        lastLogin: user.last_login ? new Date(user.last_login).toLocaleDateString('en-AU') : 'Never'
      })) || [];

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_applications_view')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Transform data to match expected format
      const transformedApplications = data?.map(app => ({
        id: app.id,
        employee: app.employee_name,
        vehicle: `${app.vehicle_data?.make || ''} ${app.vehicle_data?.model || ''}`.trim() || 'Vehicle Details',
        status: app.status,
        amount: app.financial_data?.vehicle_price || app.vehicle_data?.price || 0,
        date: new Date(app.submitted_at).toLocaleDateString('en-AU')
      })) || [];

      setApplications(transformedApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('active_quotes_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
    }
  };

  const loadRates = async () => {
    try {
      const { data, error } = await supabase
        .from('current_rates_view')
        .select('*')
        .order('rate_type', { ascending: true });

      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      console.error('Error loading rates:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      setNotifications(data?.length || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Platform Navigation
  const platformConfig = {
    driveiq: {
      name: 'MXDriveIQ',
      color: 'emerald',
      navigation: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'calculator', label: 'Lease Calculator', icon: Calculator },
        { id: 'applications', label: 'Applications', icon: FileText },
        { id: 'reporting', label: 'Emissions Reporting', icon: Leaf },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    },
    dealeradvantage: {
      name: 'MXDealerAdvantage',
      color: 'blue',
      navigation: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'calculator', label: 'Quote Engine', icon: Calculator },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'inventory', label: 'Inventory', icon: Car },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  };

  const currentPlatform = platformConfig[platformMode];

  // Calculate lease
  const calculateLease = async () => {
    const price = parseFloat(leaseForm.vehiclePrice) || 0;
    const salary = parseFloat(leaseForm.salary) || 0;
    const taxRate = parseFloat(leaseForm.taxBracket) / 100;
    const term = parseInt(leaseForm.leaseTerm);
    
    // Get current rates from database
    const interestRate = rates.find(r => r.rate_type === 'interest' && r.vehicle_category === 'sedan')?.rate_value || 0.0599;
    const residualRate = rates.find(r => r.rate_type === 'residual' && r.vehicle_category === 'sedan')?.rate_value || 0.465;
    
    // Simplified calculation
    const residualValue = price * residualRate;
    const financeAmount = price - residualValue;
    const monthlyInterest = interestRate / 12;
    const monthlyPayment = (financeAmount * monthlyInterest * Math.pow(1 + monthlyInterest, term)) / 
                          (Math.pow(1 + monthlyInterest, term) - 1);
    
    const weeklyLease = monthlyPayment / 4.33; // Convert to weekly
    const taxSavings = weeklyLease * taxRate;
    const netCost = weeklyLease - taxSavings;
    const totalSavings = taxSavings * (term * 4.33);

    const result = {
      weeklyLease: weeklyLease.toFixed(2),
      taxSavings: taxSavings.toFixed(2),
      netCost: netCost.toFixed(2),
      totalSavings: totalSavings.toFixed(2),
      fbtValue: (price * 0.2).toFixed(2)
    };

    setCalculationResult(result);

    // Save quote to database if user is logged in
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && leaseForm.fullName && leaseForm.email) {
        // Find or create employee record
        let { data: employee } = await supabase
          .from('employees')
          .select('*')
          .eq('email', leaseForm.email)
          .single();

        if (!employee) {
          // Create employee record
          const { data: newEmployee, error: employeeError } = await supabase
            .from('employees')
            .insert({
              name: leaseForm.fullName,
              email: leaseForm.email,
              phone: leaseForm.phone,
              company_id: null // Will need to be set based on employer
            })
            .select()
            .single();

          if (employeeError) throw employeeError;
          employee = newEmployee;
        }

        // Save quote
        const { error: quoteError } = await supabase
          .from('lease_quotes')
          .insert({
            employee_id: employee.id,
            company_id: employee.company_id,
            quote_data: {
              calculation_result: result,
              form_data: leaseForm
            },
            vehicle_data: {
              make: leaseForm.vehicleMake,
              model: leaseForm.vehicleModel,
              year: leaseForm.vehicleYear,
              price: price,
              fuel_type: leaseForm.fuelType
            },
            financial_data: {
              monthly_payment: monthlyPayment,
              weekly_payment: weeklyLease,
              lease_term: term,
              interest_rate: interestRate * 100,
              residual_value: residualValue,
              tax_savings: totalSavings
            },
            status: 'draft',
            created_by: user.id
          });

        if (quoteError) throw quoteError;
        
        // Reload quotes data
        loadQuotes();
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error saving quote:', error);
    }
  };

  // Add user function
  const addUser = async (userData) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          full_name: userData.name,
          email: userData.email,
          role: userData.role,
          is_active: true
        });

      if (error) throw error;
      
      // Reload users
      loadUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Quotes</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.totalQuotes}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100">
              <FileText className="text-emerald-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-green-500 text-sm ml-1">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Leases</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.activeLeases}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100">
              <Car className="text-emerald-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-green-500 text-sm ml-1">+8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${dashboardData.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100">
              <DollarSign className="text-emerald-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-green-500 text-sm ml-1">+15% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">EV Uptake</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.evUptake}%</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100">
              <Leaf className="text-emerald-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-green-500 text-sm ml-1">+22% from last month</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.employee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.vehicle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${app.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      <Eye size={16} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Calculator View
  const CalculatorView = () => (
    <div className="p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 bg-emerald-600 text-white rounded-t-lg">
          <h2 className="text-2xl font-bold">
            {platformMode === 'driveiq' ? 'Novated Lease Calculator' : 'Quote Engine'}
          </h2>
          <p className="mt-2 opacity-90">
            {platformMode === 'driveiq' 
              ? 'Calculate your savings with our smart budget generation tool'
              : 'Generate competitive quotes for your customers'
            }
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Car className="mr-2" size={20} />
                  Vehicle Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                    <input
                      type="text"
                      value={leaseForm.vehicleMake}
                      onChange={(e) => setLeaseForm({...leaseForm, vehicleMake: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Tesla"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={leaseForm.vehicleModel}
                      onChange={(e) => setLeaseForm({...leaseForm, vehicleModel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Model 3"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <select
                      value={leaseForm.vehicleYear}
                      onChange={(e) => setLeaseForm({...leaseForm, vehicleYear: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                    <select
                      value={leaseForm.fuelType}
                      onChange={(e) => setLeaseForm({...leaseForm, fuelType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Price ($)</label>
                  <input
                    type="number"
                    value={leaseForm.vehiclePrice}
                    onChange={(e) => setLeaseForm({...leaseForm, vehiclePrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="65000"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="mr-2" size={20} />
                  Personal Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={leaseForm.fullName}
                      onChange={(e) => setLeaseForm({...leaseForm, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={leaseForm.email}
                        onChange={(e) => setLeaseForm({...leaseForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={leaseForm.phone}
                        onChange={(e) => setLeaseForm({...leaseForm, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0400 000 000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary ($)</label>
                      <input
                        type="number"
                        value={leaseForm.salary}
                        onChange={(e) => setLeaseForm({...leaseForm, salary: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="80000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax Bracket (%)</label>
                      <select
                        value={leaseForm.taxBracket}
                        onChange={(e) => setLeaseForm({...leaseForm, taxBracket: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="19">19%</option>
                        <option value="32.5">32.5%</option>
                        <option value="37">37%</option>
                        <option value="45">45%</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="mr-2" size={20} />
                  Lease Options
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lease Term (months)</label>
                    <select
                      value={leaseForm.leaseTerm}
                      onChange={(e) => setLeaseForm({...leaseForm, leaseTerm: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                      <option value="48">48 months</option>
                      <option value="60">60 months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employer</label>
                    <input
                      type="text"
                      value={leaseForm.employer}
                      onChange={(e) => setLeaseForm({...leaseForm, employer: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Company Name"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <button
                  onClick={calculateLease}
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors mb-4"
                >
                  Calculate Quote
                </button>

                {calculationResult && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Calculation Results</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weekly Lease Cost:</span>
                        <span className="font-semibold">${calculationResult.weeklyLease}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weekly Tax Savings:</span>
                        <span className="font-semibold text-green-600">${calculationResult.taxSavings}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-800 font-medium">Net Weekly Cost:</span>
                        <span className="font-bold text-lg">${calculationResult.netCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Savings:</span>
                        <span className="font-semibold text-green-600">${calculationResult.totalSavings}</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors mt-4">
                      Apply Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Simple placeholder views for other sections
  const UserManagementView = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">User management functionality will be implemented here.</p>
      </div>
    </div>
  );

  const EmissionsReportingView = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Emissions Reporting</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Emissions reporting functionality will be implemented here.</p>
      </div>
    </div>
  );

  const ApplicationsView = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Applications</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Applications management functionality will be implemented here.</p>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Settings functionality will be implemented here.</p>
      </div>
    </div>
  );

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'calculator':
        return <CalculatorView />;
      case 'users':
        return <UserManagementView />;
      case 'reporting':
        return <EmissionsReportingView />;
      case 'applications':
        return <ApplicationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  // Sidebar Component
  const Sidebar = () => (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
      sidebarOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="p-4 border-b bg-emerald-600 text-white">
        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>
            {currentPlatform.name}
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-white hover:bg-opacity-20"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      <nav className="mt-4">
        {currentPlatform.navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                currentView === item.id ? 'bg-emerald-50 border-r-2 border-emerald-600' : ''
              }`}
            >
              <Icon size={20} className={`${currentView === item.id ? 'text-emerald-600' : 'text-gray-600'}`} />
              {sidebarOpen && (
                <span className={`ml-3 ${currentView === item.id ? 'text-emerald-600 font-medium' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {sidebarOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-2">Switch Platform:</p>
            <button
              onClick={() => setPlatformMode(platformMode === 'driveiq' ? 'dealeradvantage' : 'driveiq')}
              className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                platformMode === 'driveiq' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {platformMode === 'driveiq' ? 'Switch to Dealer' : 'Switch to DriveIQ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Top Header
  const TopHeader = () => (
    <div className={`fixed top-0 right-0 left-${sidebarOpen ? '64' : '16'} bg-white shadow-sm border-b z-30 transition-all duration-300`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {currentView.replace(/([A-Z])/g, ' $1').trim()}
          </h2>
          <p className="text-sm text-gray-600">
            {platformMode === 'driveiq' ? 'Employer & Employee Portal' : 'Dealer Management Portal'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-800">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopHeader />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} pt-20`}>
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default MXIntegratedPlatform;
