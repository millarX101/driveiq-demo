import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  User, 
  Car, 
  Leaf, 
  Award, 
  Target, 
  TrendingUp, 
  Calendar,
  MapPin,
  Battery,
  Home,
  ExternalLink,
  LogOut,
  Bike,
  Train,
  DollarSign,
  CheckCircle,
  Mail,
  X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import LeaseCalculatorEmbed from './LeaseCalculatorEmbed';

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJetchargeModal, setShowJetchargeModal] = useState(false);
  const [showLeaseCalculator, setShowLeaseCalculator] = useState(false);
  const [personalStats, setPersonalStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await loadPersonalData(session.user.email);
      } else {
        // For demo purposes, create a mock user when no session exists
        const mockUser = {
          email: 'employee@company.com',
          id: 'demo-user-id'
        };
        setUser(mockUser);
        await loadPersonalData(mockUser.email);
      }
    } catch (error) {
      console.error('Session check error:', error);
      // For demo purposes, create a mock user on error too
      const mockUser = {
        email: 'employee@company.com',
        id: 'demo-user-id'
      };
      setUser(mockUser);
      await loadPersonalData(mockUser.email);
    } finally {
      setLoading(false);
    }
  };

  const loadPersonalData = async (email) => {
    try {
      // Load employee data
      const { data: employee } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email)
        .single();

      if (employee) {
        // Load transport logs for this employee
        const { data: logs } = await supabase
          .from('transport_logs')
          .select('*')
          .eq('employee_id', employee.id)
          .order('log_date', { ascending: false })
          .limit(30);

        // Calculate personal statistics
        const totalEmissions = logs?.reduce((sum, log) => sum + (log.emissions_kg || 0), 0) || 0;
        const totalDistance = logs?.reduce((sum, log) => sum + (log.distance_km || 0), 0) || 0;
        const totalCost = logs?.reduce((sum, log) => sum + (log.cost_aud || 0), 0) || 0;

        setPersonalStats({
          name: employee.name,
          department: employee.department,
          primaryTransport: employee.primary_transport,
          hasEV: employee.has_ev,
          hasLease: employee.has_novated_lease,
          totalEmissions: (totalEmissions / 1000).toFixed(1), // Convert to tonnes
          totalDistance: totalDistance.toFixed(0),
          totalCost: totalCost.toFixed(0),
          logsCount: logs?.length || 0
        });

        // Set recent activity
        setRecentActivity(logs?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Error loading personal data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/employee-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getTransportIcon = (method) => {
    switch (method) {
      case 'EV':
      case 'Hybrid':
        return <Battery className="w-5 h-5 text-green-600" />;
      case 'Petrol Car':
      case 'Diesel Car':
        return <Car className="w-5 h-5 text-orange-600" />;
      case 'Public Transport':
        return <Train className="w-5 h-5 text-blue-600" />;
      case 'Cycling':
        return <Bike className="w-5 h-5 text-cyan-600" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEmissionsSaved = (method, distance) => {
    const emissionFactors = {
      'EV': 0.05,
      'Hybrid': 0.08,
      'Petrol Car': 0.18,
      'Diesel Car': 0.21,
      'Public Transport': 0.06,
      'Cycling': 0,
      'Walking': 0
    };
    
    const carEmissions = distance * 0.18; // Average car emissions
    const actualEmissions = distance * (emissionFactors[method] || 0.15);
    return Math.max(0, carEmissions - actualEmissions);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {personalStats?.name?.split(' ')[0] || 'Employee'}!
                </h1>
                <p className="text-gray-600">{personalStats?.department} • {user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Carbon Footprint</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{personalStats?.totalEmissions || 0}t</p>
            <p className="text-sm text-gray-500 mt-1">CO₂ last 30 days</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Distance Traveled</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{personalStats?.totalDistance || 0}km</p>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Transport Costs</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">${personalStats?.totalCost || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Trip Logs</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600">{personalStats?.logsCount || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Recorded trips</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <button
                onClick={() => setShowLeaseCalculator(true)}
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 w-full text-left"
              >
                <DollarSign className="w-6 h-6 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900">Calculate My Lease</h4>
                  <p className="text-sm text-blue-700">Get personalized quotes & scenarios</p>
                </div>
              </button>
              
              {personalStats?.hasEV && (
                <button
                  onClick={() => setShowJetchargeModal(true)}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200 w-full text-left"
                >
                  <Home className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900">Home Charging Setup</h4>
                    <p className="text-sm text-green-700">Install EV charger with Jetcharge</p>
                  </div>
                  <Battery className="w-4 h-4 text-green-600" />
                </button>
              )}

              <button
                onClick={() => navigate('/form')}
                className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 w-full text-left"
              >
                <Car className="w-6 h-6 text-purple-600" />
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900">Update Vehicle Info</h4>
                  <p className="text-sm text-purple-700">Add or update your vehicle details</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Commutes</h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getTransportIcon(activity.transport_method)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.transport_method} • {activity.distance_km?.toFixed(1)}km
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.log_date).toLocaleDateString()} • 
                        Saved {getEmissionsSaved(activity.transport_method, activity.distance_km).toFixed(1)}kg CO₂
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${activity.cost_aud?.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{activity.emissions_kg?.toFixed(2)}kg CO₂</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Car className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No commute data yet</p>
                  <p className="text-sm">Start logging your trips to see insights</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transport Summary */}
        {personalStats?.primaryTransport && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Transport Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  {getTransportIcon(personalStats.primaryTransport)}
                </div>
                <h4 className="font-semibold text-gray-900">{personalStats.primaryTransport}</h4>
                <p className="text-sm text-gray-500">Primary transport method</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  {personalStats.hasEV ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <X className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h4 className="font-semibold text-gray-900">
                  {personalStats.hasEV ? 'EV Owner' : 'No EV'}
                </h4>
                <p className="text-sm text-gray-500">Electric vehicle status</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  {personalStats.hasLease ? (
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  ) : (
                    <X className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h4 className="font-semibold text-gray-900">
                  {personalStats.hasLease ? 'Has Lease' : 'No Lease'}
                </h4>
                <p className="text-sm text-gray-500">Novated lease status</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Jetcharge Modal */}
      {showJetchargeModal && (
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
      )}

      {/* Lease Calculator Modal */}
      <LeaseCalculatorEmbed 
        isOpen={showLeaseCalculator} 
        onClose={() => setShowLeaseCalculator(false)} 
      />
    </div>
  );
};

export default EmployeeDashboard;
