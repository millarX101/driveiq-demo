import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import LeaseCalculatorEmbed from '../../components/LeaseCalculatorEmbed';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Settings,
  Calculator,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Edit,
  Eye,
  Search,
  Filter,
  Bell,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Users,
  Target,
  Activity,
  Zap,
  HelpCircle,
  Menu,
  Home,
  Briefcase,
  PieChart,
  Car
} from 'lucide-react';

const MXDealerDashboardImproved = () => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [currentUser, setCurrentUser] = useState({
    name: 'Sarah Mitchell',
    dealership: 'Premium Motors Melbourne',
    dealerId: 'PM001',
    role: 'Senior Sales Manager',
    email: 'sarah.mitchell@premiummotors.com.au',
    phone: '+61 3 9123 4567',
    territory: 'Melbourne Metro',
    tier: 'Gold Partner'
  });

  // Simplified data states
  const [quotes, setQuotes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [metrics, setMetrics] = useState({
    thisMonth: {
      quotesGenerated: 24,
      conversions: 8,
      conversionRate: 33.3,
      revenue: 180000,
      commissionEarned: 9000,
      avgDealValue: 22500
    },
    lastMonth: {
      quotesGenerated: 18,
      conversions: 6,
      conversionRate: 33.3,
      revenue: 135000,
      commissionEarned: 6750,
      avgDealValue: 22500
    }
  });

  // Load data on component mount
  useEffect(() => {
    loadUserData();
    loadQuotes();
    loadApplications();
  }, []);

  const loadUserData = async () => {
    try {
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        const parsedDemoUser = JSON.parse(demoUser);
        setCurrentUser({
          name: parsedDemoUser.user_metadata?.full_name || 'Demo Dealer',
          dealership: 'Demo Dealership',
          dealerId: 'DEMO001',
          role: 'Sales Manager',
          email: parsedDemoUser.email,
          phone: '+61 3 9123 4567',
          territory: 'Melbourne Metro',
          tier: 'Gold Partner'
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('active_quotes_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading quotes:', error);
        setQuotes([]);
      } else {
        setQuotes(data || []);
        // Update metrics based on real data
        updateMetricsFromData(data || []);
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
      setQuotes([]);
    }
  };

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_applications_view')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error loading applications:', error);
        setApplications([]);
      } else {
        setApplications(data || []);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
    }
  };

  // Update metrics based on real data
  const updateMetricsFromData = (quotesData) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthQuotes = quotesData.filter(quote => {
      const quoteDate = new Date(quote.created_at);
      return quoteDate.getMonth() === currentMonth && quoteDate.getFullYear() === currentYear;
    });

    const approvedQuotes = thisMonthQuotes.filter(quote => quote.status === 'approved');
    const totalRevenue = approvedQuotes.reduce((sum, quote) => {
      const monthlyPayment = quote.financial_data?.monthly_payment || 0;
      return sum + (monthlyPayment * 12); // Annualized
    }, 0);

    const conversionRate = thisMonthQuotes.length > 0 
      ? ((approvedQuotes.length / thisMonthQuotes.length) * 100).toFixed(1)
      : 0;

    const avgDealValue = approvedQuotes.length > 0 
      ? totalRevenue / approvedQuotes.length 
      : 0;

    const commissionRate = 0.05; // 5% commission
    const commissionEarned = totalRevenue * commissionRate;

    setMetrics(prev => ({
      ...prev,
      thisMonth: {
        quotesGenerated: thisMonthQuotes.length,
        conversions: approvedQuotes.length,
        conversionRate: parseFloat(conversionRate),
        revenue: totalRevenue,
        commissionEarned: commissionEarned,
        avgDealValue: avgDealValue
      }
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  // Simplified Navigation
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home, description: 'Dashboard home' },
    { id: 'quotes', label: 'Quotes', icon: FileText, description: 'Manage quotes', badge: quotes.length },
    { id: 'applications', label: 'Applications', icon: Briefcase, description: 'Track applications', badge: applications.length },
    { id: 'calculator', label: 'New Quote', icon: Plus, description: 'Create quote', primary: true }
  ];

  // Quick Action Card Component
  const QuickActionCard = ({ title, description, icon: Icon, onClick, primary = false, badge }) => (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-xl border-2 transition-all text-left group hover:shadow-lg ${
        primary 
          ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
          : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${
          primary ? 'bg-green-500' : 'bg-green-100 group-hover:bg-green-200'
        }`}>
          <Icon className={`h-6 w-6 ${primary ? 'text-white' : 'text-green-600'}`} />
        </div>
        {badge && (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            primary ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'
          }`}>
            {badge}
          </span>
        )}
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${primary ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-sm ${primary ? 'text-green-100' : 'text-gray-600'}`}>
        {description}
      </p>
      <ChevronRight className={`h-5 w-5 mt-3 ${primary ? 'text-green-200' : 'text-gray-400'}`} />
    </button>
  );

  // Metric Card Component
  const MetricCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            <ArrowUpRight size={16} className="mr-1" />
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  // Recent Activity Item
  const ActivityItem = ({ quote }) => (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
      <div className={`p-2 rounded-full ${
        quote.status === 'approved' ? 'bg-green-100' : 
        quote.status === 'submitted' ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        {quote.status === 'approved' ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : quote.status === 'submitted' ? (
          <Clock className="h-4 w-4 text-blue-600" />
        ) : (
          <FileText className="h-4 w-4 text-gray-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {quote.employee_name}
        </p>
        <p className="text-xs text-gray-500">
          {quote.quote_number} • {formatDate(quote.created_at)}
        </p>
      </div>
      <div className="text-right">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          quote.status === 'approved' ? 'bg-green-100 text-green-800' :
          quote.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
        </span>
      </div>
    </div>
  );

  // Overview Dashboard
  const OverviewDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
            <p className="text-green-100 text-lg mb-1">{currentUser.dealership}</p>
            <p className="text-green-200">{currentUser.tier} • {currentUser.territory}</p>
          </div>
          <div className="text-center lg:text-right">
            <p className="text-4xl font-bold mb-1">{metrics.thisMonth.quotesGenerated}</p>
            <p className="text-green-100 text-lg">Quotes This Month</p>
            <p className="text-green-200 text-sm">
              +{metrics.thisMonth.quotesGenerated - metrics.lastMonth.quotesGenerated} from last month
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Create New Quote"
            description="Start a new lease quote for your customer"
            icon={Plus}
            onClick={() => setActiveView('calculator')}
            primary={true}
          />
          <QuickActionCard
            title="View Quotes"
            description="Manage and track all your quotes"
            icon={FileText}
            onClick={() => setActiveView('quotes')}
            badge={quotes.length}
          />
          <QuickActionCard
            title="Applications"
            description="Review pending applications"
            icon={Briefcase}
            onClick={() => setActiveView('applications')}
            badge={applications.length}
          />
          <QuickActionCard
            title="Performance"
            description="View your sales analytics"
            icon={BarChart3}
            onClick={() => setActiveView('analytics')}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">This Month's Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Quotes Generated"
            value={metrics.thisMonth.quotesGenerated}
            subtitle="This month"
            icon={FileText}
            trend="up"
            trendValue={`+${metrics.thisMonth.quotesGenerated - metrics.lastMonth.quotesGenerated}`}
          />
          <MetricCard
            title="Conversions"
            value={metrics.thisMonth.conversions}
            subtitle={`${metrics.thisMonth.conversionRate}% conversion rate`}
            icon={TrendingUp}
            trend="up"
            trendValue={`+${metrics.thisMonth.conversions - metrics.lastMonth.conversions}`}
          />
          <MetricCard
            title="Commission Earned"
            value={formatCurrency(metrics.thisMonth.commissionEarned)}
            subtitle="This month"
            icon={DollarSign}
            trend="up"
            trendValue={formatCurrency(metrics.thisMonth.commissionEarned - metrics.lastMonth.commissionEarned)}
          />
          <MetricCard
            title="Average Deal"
            value={formatCurrency(metrics.thisMonth.avgDealValue)}
            subtitle="Per conversion"
            icon={Target}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <button
            onClick={() => setActiveView('quotes')}
            className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
          >
            View all quotes
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="space-y-3">
          {quotes.slice(0, 5).map((quote) => (
            <ActivityItem key={quote.id} quote={quote} />
          ))}
          {quotes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
              <p className="text-gray-500 mb-6">Create your first quote to get started</p>
              <button
                onClick={() => setActiveView('calculator')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create First Quote
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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

  // Calculate lease
  const calculateLease = async () => {
    const price = parseFloat(leaseForm.vehiclePrice) || 0;
    const salary = parseFloat(leaseForm.salary) || 0;
    const taxRate = parseFloat(leaseForm.taxBracket) / 100;
    const term = parseInt(leaseForm.leaseTerm);
    
    // Get current rates from database (fallback to defaults if not available)
    const interestRate = 0.0599; // 5.99%
    const residualRate = 0.465; // 46.5%
    
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
  };

  // Handle quote saved callback
  const handleQuoteSaved = (result) => {
    if (result.success) {
      // Refresh quotes list
      loadQuotes();
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        thisMonth: {
          ...prev.thisMonth,
          quotesGenerated: prev.thisMonth.quotesGenerated + 1
        }
      }));
    }
  };

  // Calculator modal state
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  // Full Calculator View
  const CalculatorView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Novated Lease Calculator</h2>
          <p className="text-gray-600">Generate quotes using your existing calculator system</p>
        </div>
        
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Launch Calculator</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Open your professional lease calculator to generate quotes for customers. 
            The calculator will open in a full-screen modal for the best experience.
          </p>
          <button
            onClick={() => setShowCalculatorModal(true)}
            className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg flex items-center space-x-3 mx-auto"
          >
            <Calculator size={24} />
            <span>Open Calculator</span>
          </button>
        </div>
      </div>
      
      {/* Calculator Modal */}
      <LeaseCalculatorEmbed 
        isOpen={showCalculatorModal} 
        onClose={() => setShowCalculatorModal(false)} 
      />
    </div>
  );

  // Simplified Quotes View
  const QuotesView = () => {
    const filteredQuotes = quotes.filter(quote => {
      const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
      const matchesSearch = searchTerm === '' || 
        quote.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quote Management</h2>
            <p className="text-gray-600 mt-1">{quotes.length} total quotes</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Quote Cards for better mobile experience */}
        <div className="space-y-4">
          {filteredQuotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{quote.quote_number}</h3>
                      <p className="text-sm text-gray-600">
                        {quote.vehicle_data?.make} {quote.vehicle_data?.model}
                      </p>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                      quote.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Employee</p>
                      <p className="font-medium">{quote.employee_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Company</p>
                      <p className="font-medium">{quote.company_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium">{formatDate(quote.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monthly Payment</p>
                      <p className="font-medium">
                        {quote.financial_data?.monthly_payment 
                          ? formatCurrency(quote.financial_data.monthly_payment)
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedQuote(quote);
                      setShowQuoteModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredQuotes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Create your first quote to get started.'}
              </p>
              <button
                onClick={() => setActiveView('calculator')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create New Quote
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Applications View
  const ApplicationsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
          <p className="text-gray-600 mt-1">{applications.length} pending applications</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{application.application_number}</h3>
                    <p className="text-sm text-gray-600">{application.employee_name}</p>
                  </div>
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {application.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500">Applications will appear here once employees submit them.</p>
          </div>
        )}
      </div>
    </div>
  );

  // Quote Details Modal (simplified)
  const QuoteModal = () => (
    showQuoteModal && selectedQuote && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Quote Details</h3>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Quote Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quote Number:</span>
                    <span className="font-semibold">{selectedQuote.quote_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedQuote.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedQuote.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-semibold">{formatDate(selectedQuote.created_at)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Employee Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold">{selectedQuote.employee_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{selectedQuote.employee_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-semibold">{selectedQuote.company_name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowQuoteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium">
                Edit Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewDashboard />;
      case 'calculator':
        return <CalculatorView />;
      case 'quotes':
        return <QuotesView />;
      case 'applications':
        return <ApplicationsView />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-center py-12">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-500">Advanced analytics and reporting features will be available here.</p>
              </div>
            </div>
          </div>
        );
      default:
        return <OverviewDashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600">MXDealerAdvantage</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Dealer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.dealership}</p>
                </div>
                <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Simplified Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeView === item.id
                    ? item.primary 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    activeView === item.id 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Quote Modal */}
      <QuoteModal />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2025 MXDealerAdvantage. Novated Leasing Sales Platform
            </div>
            <div className="flex space-x-6 text-sm">
              <button className="text-gray-500 hover:text-gray-700">Support</button>
              <button className="text-gray-500 hover:text-gray-700">Training</button>
              <button className="text-gray-500 hover:text-gray-700">Terms</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MXDealerDashboardImproved;
