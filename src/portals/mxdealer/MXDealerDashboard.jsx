import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Plus, 
  Settings,
  Users,
  Car,
  Calculator,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Edit,
  Save,
  Building,
  Activity,
  PieChart,
  Filter,
  Calendar,
  Eye,
  ExternalLink,
  TrendingDown,
  Shield,
  Briefcase,
  ClipboardList,
  Search,
  Mail,
  Phone,
  MapPin,
  Clock,
  Target,
  Award,
  Globe,
  Zap,
  UserCheck,
  Building2,
  Percent,
  Bookmark,
  Star,
  Archive,
  RefreshCw,
  Upload,
  MonitorPlay,
  BarChart,
  LineChart,
  PlusCircle,
  Trash2,
  Copy,
  Send,
  Bell,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const MXDealerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
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

  // Real data from Supabase
  const [quotes, setQuotes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [rates, setRates] = useState([]);
  const [metrics, setMetrics] = useState({
    thisMonth: {
      quotesGenerated: 0,
      conversions: 0,
      conversionRate: 0,
      revenue: 0,
      commissionEarned: 0,
      avgDealValue: 0
    },
    lastMonth: {
      quotesGenerated: 0,
      conversions: 0,
      conversionRate: 0,
      revenue: 0,
      commissionEarned: 0,
      avgDealValue: 0
    },
    ytd: {
      quotesGenerated: 0,
      conversions: 0,
      conversionRate: 0,
      revenue: 0,
      commissionEarned: 0,
      avgDealValue: 0
    }
  });

  // Load all data on component mount
  useEffect(() => {
    loadUserData();
    loadQuotes();
    loadApplications();
    loadRates();
    calculateMetrics();
  }, []);

  const loadUserData = async () => {
    try {
      // Check for demo user first
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
        return;
      }

      // Regular Supabase session handling
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile data
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profile && !error) {
          setCurrentUser({
            name: profile.full_name || session.user.user_metadata?.full_name || 'Dealer',
            dealership: profile.company_name || 'Your Dealership',
            dealerId: profile.employee_id || 'DEAL001',
            role: profile.role || 'Sales Manager',
            email: session.user.email,
            phone: profile.phone || '+61 3 9123 4567',
            territory: profile.territory || 'Melbourne Metro',
            tier: profile.tier || 'Gold Partner'
          });
        }
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
        return;
      }

      setQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
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
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const loadRates = async () => {
    try {
      const { data, error } = await supabase
        .from('current_rates_view')
        .select('*')
        .order('rate_type', { ascending: true });

      if (error) {
        console.error('Error loading rates:', error);
        return;
      }

      setRates(data || []);
    } catch (error) {
      console.error('Error loading rates:', error);
    }
  };

  const calculateMetrics = async () => {
    try {
      // Get current month data
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const { data: thisMonthQuotes, error: thisMonthError } = await supabase
        .from('lease_quotes')
        .select('*')
        .gte('created_at', new Date(currentYear, currentMonth, 1).toISOString())
        .lt('created_at', new Date(currentYear, currentMonth + 1, 1).toISOString());

      const { data: lastMonthQuotes, error: lastMonthError } = await supabase
        .from('lease_quotes')
        .select('*')
        .gte('created_at', new Date(currentYear, currentMonth - 1, 1).toISOString())
        .lt('created_at', new Date(currentYear, currentMonth, 1).toISOString());

      const { data: ytdQuotes, error: ytdError } = await supabase
        .from('lease_quotes')
        .select('*')
        .gte('created_at', new Date(currentYear, 0, 1).toISOString());

      if (!thisMonthError && !lastMonthError && !ytdError) {
        const calculatePeriodMetrics = (quotes) => {
          const total = quotes?.length || 0;
          const approved = quotes?.filter(q => q.status === 'approved').length || 0;
          const conversionRate = total > 0 ? (approved / total) * 100 : 0;
          
          // Estimate revenue based on quote data
          const estimatedRevenue = quotes?.reduce((sum, quote) => {
            if (quote.status === 'approved' && quote.financial_data?.monthly_payment) {
              return sum + (quote.financial_data.monthly_payment * 12); // Annual value
            }
            return sum;
          }, 0) || 0;

          const avgDealValue = approved > 0 ? estimatedRevenue / approved : 0;
          const commissionEarned = estimatedRevenue * 0.05; // Assume 5% commission

          return {
            quotesGenerated: total,
            conversions: approved,
            conversionRate: Math.round(conversionRate * 10) / 10,
            revenue: Math.round(estimatedRevenue),
            commissionEarned: Math.round(commissionEarned),
            avgDealValue: Math.round(avgDealValue)
          };
        };

        setMetrics({
          thisMonth: calculatePeriodMetrics(thisMonthQuotes),
          lastMonth: calculatePeriodMetrics(lastMonthQuotes),
          ytd: calculatePeriodMetrics(ytdQuotes)
        });
      }
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
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

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  // Stable input handlers to prevent re-rendering issues
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleFilterChange = useCallback((value) => {
    setFilterStatus(value);
  }, []);

  // Navigation components
  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
        active 
          ? 'bg-green-600 text-white shadow-lg' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  // Dashboard Overview Component
  const DealerDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h2>
            <p className="text-green-100 mb-1">{currentUser.dealership} • {currentUser.tier}</p>
            <p className="text-green-200 text-sm">{currentUser.territory}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{metrics.thisMonth.quotesGenerated}</p>
            <p className="text-green-100">Quotes This Month</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Quotes Generated"
          value={metrics.thisMonth.quotesGenerated}
          subtitle="This month"
          icon={BarChart3}
          color="blue"
          trend={metrics.thisMonth.quotesGenerated >= metrics.lastMonth.quotesGenerated ? 'up' : 'down'}
          trendValue={Math.abs(metrics.thisMonth.quotesGenerated - metrics.lastMonth.quotesGenerated)}
        />
        <MetricCard
          title="Conversions"
          value={metrics.thisMonth.conversions}
          subtitle={`${metrics.thisMonth.conversionRate}% conversion rate`}
          icon={TrendingUp}
          color="green"
          trend={metrics.thisMonth.conversions >= metrics.lastMonth.conversions ? 'up' : 'down'}
          trendValue={Math.abs(metrics.thisMonth.conversions - metrics.lastMonth.conversions)}
        />
        <MetricCard
          title="Commission Earned"
          value={formatCurrency(metrics.thisMonth.commissionEarned)}
          subtitle="This month"
          icon={DollarSign}
          color="purple"
          trend={metrics.thisMonth.commissionEarned >= metrics.lastMonth.commissionEarned ? 'up' : 'down'}
          trendValue={formatCurrency(Math.abs(metrics.thisMonth.commissionEarned - metrics.lastMonth.commissionEarned))}
        />
        <MetricCard
          title="YTD Revenue"
          value={formatCurrency(metrics.ytd.revenue)}
          subtitle={`Avg: ${formatCurrency(metrics.thisMonth.avgDealValue)}`}
          icon={Target}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('calculator')}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Calculator size={20} />
              <span>Create New Quote</span>
            </button>
            <button 
              onClick={() => setActiveTab('quotes')}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <FileText size={20} />
              <span>View All Quotes ({quotes.length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ClipboardList size={20} />
              <span>Pending Applications ({applications.length})</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {quotes.slice(0, 3).map((quote, index) => (
              <div key={quote.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                quote.status === 'approved' ? 'bg-green-50' : 
                quote.status === 'submitted' ? 'bg-blue-50' : 'bg-gray-50'
              }`}>
                {quote.status === 'approved' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : quote.status === 'submitted' ? (
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                ) : (
                  <Info className="h-5 w-5 text-gray-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {quote.status === 'approved' ? 'Quote Approved' : 
                     quote.status === 'submitted' ? 'Quote Submitted' : 'Quote Created'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {quote.employee_name} - {quote.quote_number}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(quote.created_at)}</p>
                </div>
              </div>
            ))}
            {quotes.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent quotes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">This Month</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quotes:</span>
                <span className="font-semibold">{metrics.thisMonth.quotesGenerated}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Conversions:</span>
                <span className="font-semibold">{metrics.thisMonth.conversions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rate:</span>
                <span className="font-semibold">{formatPercentage(metrics.thisMonth.conversionRate)}</span>
              </div>
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">Last Month</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quotes:</span>
                <span className="font-semibold">{metrics.lastMonth.quotesGenerated}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Conversions:</span>
                <span className="font-semibold">{metrics.lastMonth.conversions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rate:</span>
                <span className="font-semibold">{formatPercentage(metrics.lastMonth.conversionRate)}</span>
              </div>
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900 mb-2">Year to Date</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quotes:</span>
                <span className="font-semibold">{metrics.ytd.quotesGenerated}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Conversions:</span>
                <span className="font-semibold">{metrics.ytd.conversions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rate:</span>
                <span className="font-semibold">{formatPercentage(metrics.ytd.conversionRate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Calculator Component
  const Calculator = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Lease Calculator</h2>
        <div className="text-sm text-gray-600">
          Generate quotes for your customers
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                MXDealer Advantage Calculator
              </p>
              <p className="text-xs text-blue-700">
                This calculator connects directly to the MXDealer system. All quotes generated will be automatically saved to your dashboard.
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative bg-gray-50 rounded-lg" style={{ height: '800px' }}>
          <iframe
            src="https://www.mxdealeradvantage.com.au/calculator"
            className="w-full h-full border-0 rounded-lg"
            title="MXDealer Advantage Calculator"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );

  // Quotes Management Component
  const QuotesManagement = () => {
    const filteredQuotes = quotes.filter(quote => {
      const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
      const matchesSearch = searchTerm === '' || 
        quote.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.company_name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Quote Management</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredQuotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quote Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{quote.quote_number}</div>
                          <div className="text-sm text-gray-500">
                            {quote.vehicle_data?.make} {quote.vehicle_data?.model}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{quote.employee_name}</div>
                          <div className="text-sm text-gray-500">{quote.employee_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quote.company_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                          quote.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(quote.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedQuote(quote);
                            setShowQuoteModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Start by creating your first quote using the calculator.'}
              </p>
              <button
                onClick={() => setActiveTab('calculator')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create First Quote
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Applications Management Component
  const ApplicationsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
        <div className="text-sm text-gray-600">
          {applications.length} pending applications
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{application.application_number}</div>
                        <div className="text-sm text-gray-500">{application.quote_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{application.employee_name}</div>
                        <div className="text-sm text-gray-500">{application.employee_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.company_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.submitted_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        <Eye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">Applications will appear here once employees submit them.</p>
          </div>
        )}
      </div>
    </div>
  );

  // Rates Management Component
  const RatesManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Rate Management</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Rate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interest Rates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interest Rates</h3>
          <div className="space-y-3">
            {rates.filter(rate => rate.rate_type === 'interest').map((rate) => (
              <div key={rate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {rate.vehicle_category ? rate.vehicle_category.charAt(0).toUpperCase() + rate.vehicle_category.slice(1) : 'General'}
                  </p>
                  <p className="text-xs text-gray-500">Interest Rate</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{(rate.rate_value * 100).toFixed(2)}%</p>
                  <p className="text-xs text-gray-500">Annual</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Residual Values */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Residual Values</h3>
          <div className="space-y-3">
            {rates.filter(rate => rate.rate_type === 'residual').map((rate) => (
              <div key={rate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {rate.vehicle_category ? rate.vehicle_category.charAt(0).toUpperCase() + rate.vehicle_category.slice(1) : 'General'}
                  </p>
                  <p className="text-xs text-gray-500">Residual Value</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{(rate.rate_value * 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">After 4 years</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fees */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fees</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rates.filter(rate => ['admin_fee', 'broker_fee'].includes(rate.rate_type)).map((rate) => (
              <div key={rate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {rate.rate_type === 'admin_fee' ? 'Administration Fee' : 'Broker Fee'}
                  </p>
                  <p className="text-xs text-gray-500">One-time fee</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(rate.rate_value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Quote Details Modal
  const QuoteModal = () => (
    showQuoteModal && selectedQuote && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                <div className="space-y-2">
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Until:</span>
                    <span className="font-semibold">{selectedQuote.valid_until ? formatDate(selectedQuote.valid_until) : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Employee Details</h4>
                <div className="space-y-2">
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

            {selectedQuote.vehicle_data && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Make:</span>
                      <span className="font-semibold">{selectedQuote.vehicle_data.make || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-semibold">{selectedQuote.vehicle_data.model || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year:</span>
                      <span className="font-semibold">{selectedQuote.vehicle_data.year || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold">{selectedQuote.vehicle_data.price ? formatCurrency(selectedQuote.vehicle_data.price) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedQuote.financial_data && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Financial Details</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Payment:</span>
                      <span className="font-semibold">{selectedQuote.financial_data.monthly_payment ? formatCurrency(selectedQuote.financial_data.monthly_payment) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lease Term:</span>
                      <span className="font-semibold">{selectedQuote.financial_data.lease_term || 'N/A'} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-semibold">{selectedQuote.financial_data.interest_rate ? `${selectedQuote.financial_data.interest_rate}%` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Residual Value:</span>
                      <span className="font-semibold">{selectedQuote.financial_data.residual_value ? formatCurrency(selectedQuote.financial_data.residual_value) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowQuoteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                Edit Quote
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium">
                Approve Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DealerDashboard />;
      case 'calculator':
        return <Calculator />;
      case 'quotes':
        return <QuotesManagement />;
      case 'applications':
        return <ApplicationsManagement />;
      case 'rates':
        return <RatesManagement />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">Advanced analytics and reporting features will be implemented here.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">Dealer settings and configuration options will be implemented here.</p>
            </div>
          </div>
        );
      default:
        return <DealerDashboard />;
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
      <header className="bg-white shadow-sm border-b border-gray-200">
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

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            <TabButton
              id="dashboard"
              label="Dashboard"
              icon={BarChart3}
              active={activeTab === 'dashboard'}
              onClick={setActiveTab}
            />
            <TabButton
              id="calculator"
              label="Calculator"
              icon={Calculator}
              active={activeTab === 'calculator'}
              onClick={setActiveTab}
            />
            <TabButton
              id="quotes"
              label="Quotes"
              icon={FileText}
              active={activeTab === 'quotes'}
              onClick={setActiveTab}
            />
            <TabButton
              id="applications"
              label="Applications"
              icon={ClipboardList}
              active={activeTab === 'applications'}
              onClick={setActiveTab}
            />
            <TabButton
              id="rates"
              label="Rates"
              icon={Percent}
              active={activeTab === 'rates'}
              onClick={setActiveTab}
            />
            <TabButton
              id="analytics"
              label="Analytics"
              icon={BarChart}
              active={activeTab === 'analytics'}
              onClick={setActiveTab}
            />
            <TabButton
              id="settings"
              label="Settings"
              icon={Settings}
              active={activeTab === 'settings'}
              onClick={setActiveTab}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderTabContent()}
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

export default MXDealerDashboard;
