import React, { useState, useEffect } from 'react';
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
  Bell
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

  // Load user data from Supabase
  useEffect(() => {
    loadUserData();
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
        setLoading(false);
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
        } else {
          // Fallback to session data
          setCurrentUser({
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Dealer',
            dealership: 'Your Dealership',
            dealerId: 'DEAL001',
            role: 'Sales Manager',
            email: session.user.email,
            phone: '+61 3 9123 4567',
            territory: 'Melbourne Metro',
            tier: 'Gold Partner'
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Keep default fallback data
    } finally {
      setLoading(false);
    }
  };

  // Performance metrics
  const [metrics, setMetrics] = useState({
    thisMonth: {
      quotesGenerated: 47,
      conversions: 12,
      conversionRate: 25.5,
      revenue: 147250,
      commissionEarned: 18945,
      avgDealValue: 12270
    },
    lastMonth: {
      quotesGenerated: 52,
      conversions: 15,
      conversionRate: 28.8,
      revenue: 184300,
      commissionEarned: 23145,
      avgDealValue: 12287
    },
    ytd: {
      quotesGenerated: 99,
      conversions: 27,
      conversionRate: 27.3,
      revenue: 331550,
      commissionEarned: 42090,
      avgDealValue: 12279
    }
  });

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

  // Navigation components
  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
        active 
          ? 'bg-green-600 text-white shadow-lg' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  // Dashboard Overview Component
  const DealerDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">vs last month</p>
              <p className={`text-sm font-medium ${metrics.thisMonth.quotesGenerated > metrics.lastMonth.quotesGenerated ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.thisMonth.quotesGenerated > metrics.lastMonth.quotesGenerated ? '+' : ''}{metrics.thisMonth.quotesGenerated - metrics.lastMonth.quotesGenerated}
              </p>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{metrics.thisMonth.quotesGenerated}</p>
            <p className="text-sm text-gray-600">Quotes Generated</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">conversion rate</p>
              <p className="text-sm font-medium text-green-600">{metrics.thisMonth.conversionRate}%</p>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{metrics.thisMonth.conversions}</p>
            <p className="text-sm text-gray-600">Conversions</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">this month</p>
              <p className="text-sm font-medium text-purple-600">{formatCurrency(metrics.thisMonth.revenue)}</p>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.thisMonth.commissionEarned)}</p>
            <p className="text-sm text-gray-600">Commission Earned</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">avg deal</p>
              <p className="text-sm font-medium text-orange-600">{formatCurrency(metrics.thisMonth.avgDealValue)}</p>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.ytd.revenue)}</p>
            <p className="text-sm text-gray-600">YTD Revenue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('new-quote')}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Create New Quote</span>
            </button>
            <button 
              onClick={() => setActiveTab('quotes')}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <FileText size={20} />
              <span>View All Quotes</span>
            </button>
            <button 
              onClick={() => setActiveTab('calculator')}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Calculator size={20} />
              <span>Lease Calculator</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Quote Converted</p>
                <p className="text-xs text-gray-600">David Park - Mercedes EQC - {formatCurrency(11667)} profit</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">New Quote Created</p>
                <p className="text-xs text-gray-600">Michael Johnson - Tesla Model 3 - Pending response</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Quote Expiring Soon</p>
                <p className="text-xs text-gray-600">Emma Chen - BMW iX3 - Expires 5 Feb</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart size={48} className="mx-auto mb-2" />
            <p>Performance Chart</p>
            <p className="text-sm">Integration with chart library needed</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Calculator Component
  const Calculator = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Lease Calculator</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Note:</strong> This calculator loads the actual MXDealer Advantage calculator interface directly.
          </p>
          <p className="text-xs text-gray-500">
            The calculator will open with all features including vehicle selection, financial calculations, and quote generation.
          </p>
        </div>
        
        <div className="relative" style={{ height: '800px' }}>
          <iframe
            src="https://www.mxdealeradvantage.com.au/calculator"
            className="w-full h-full border border-gray-300 rounded-lg"
            title="MXDealer Advantage Calculator"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DealerDashboard />;
      case 'calculator':
        return <Calculator />;
      case 'quotes':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Quote Management</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">Quote management features will be implemented here.</p>
            </div>
          </div>
        );
      case 'applications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">Application management features will be implemented here.</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">Analytics and reporting features will be implemented here.</p>
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
