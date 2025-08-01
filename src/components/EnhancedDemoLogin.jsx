import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Building2, Users, Car, Shield, Database, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '../supabaseClient';

const EnhancedDemoLogin = ({ portalType = 'employee' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [demoCredentials, setDemoCredentials] = useState([]);
  const [useSupabaseData, setUseSupabaseData] = useState(true);
  const navigate = useNavigate();

  // Fallback hardcoded credentials (same as before)
  const fallbackCredentials = {
    employee: [
      { email: 'sarah.chen@techflowsolutions.com.au', password: 'demo123', name: 'Sarah Chen', userId: 'techflow-emp-001' },
      { email: 'michael.rodriguez@techflowsolutions.com.au', password: 'demo123', name: 'Michael Rodriguez', userId: 'techflow-emp-002' },
      { email: 'emma.thompson@techflowsolutions.com.au', password: 'demo123', name: 'Emma Thompson', userId: 'techflow-emp-003' },
      { email: 'james.wilson@techflowsolutions.com.au', password: 'demo123', name: 'James Wilson', userId: 'techflow-emp-004' },
      { email: 'alex.kim@techflowsolutions.com.au', password: 'demo123', name: 'Alex Kim', userId: 'techflow-emp-005' },
      { email: 'lisa.patel@techflowsolutions.com.au', password: 'demo123', name: 'Lisa Patel', userId: 'techflow-emp-006' },
      { email: 'david.nguyen@techflowsolutions.com.au', password: 'demo123', name: 'David Nguyen', userId: 'techflow-emp-007' }
    ],
    employer: [
      { email: 'admin@techflowsolutions.com.au', password: 'admin123', name: 'TechFlow Admin', userId: 'techflow-hr-001' }
    ],
    mxdealer: [
      { email: 'dealer@mxdriveiq.com.au', password: 'dealer123', name: 'MX Dealer', userId: 'mxdealer-001' }
    ],
    admin: [
      { email: 'admin@mxdriveiq.com.au', password: 'admin123', name: 'System Admin', userId: 'admin-001' }
    ]
  };

  const portalConfig = {
    employee: {
      title: 'Employee Portal',
      subtitle: 'TechFlow Solutions Pty Ltd',
      icon: User,
      color: 'blue',
      dashboardPath: '/employee/dashboard'
    },
    employer: {
      title: 'Employer Portal',
      subtitle: 'Company Management',
      icon: Building2,
      color: 'green',
      dashboardPath: '/employer/dashboard'
    },
    mxdealer: {
      title: 'MXDealer Portal',
      subtitle: 'Dealer Management',
      icon: Car,
      color: 'purple',
      dashboardPath: '/mxdealer/dashboard'
    },
    admin: {
      title: 'Admin Portal',
      subtitle: 'System Administration',
      icon: Shield,
      color: 'red',
      dashboardPath: '/admin/dashboard'
    }
  };

  const config = portalConfig[portalType];
  const IconComponent = config.icon;

  // Check Supabase connection and load real demo data
  useEffect(() => {
    checkSupabaseConnection();
  }, [portalType]);

  const checkSupabaseConnection = async () => {
    try {
      // Test Supabase connection
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, email, full_name, role')
        .eq('portal_type', portalType)
        .limit(10);

      if (error) {
        console.warn('Supabase connection failed, using fallback data:', error);
        setSupabaseConnected(false);
        setDemoCredentials(fallbackCredentials[portalType]);
        setUseSupabaseData(false);
      } else {
        console.log('✅ Supabase connected successfully, loaded real demo data');
        setSupabaseConnected(true);
        
        // Transform Supabase data to match our credential format
        const supabaseCredentials = data.map(user => ({
          email: user.email,
          password: portalType === 'employee' ? 'demo123' : 
                   portalType === 'employer' ? 'admin123' :
                   portalType === 'mxdealer' ? 'dealer123' : 'admin123',
          name: user.full_name,
          userId: user.user_id,
          role: user.role
        }));
        
        setDemoCredentials(supabaseCredentials.length > 0 ? supabaseCredentials : fallbackCredentials[portalType]);
      }
    } catch (error) {
      console.warn('Supabase connection error, using fallback data:', error);
      setSupabaseConnected(false);
      setDemoCredentials(fallbackCredentials[portalType]);
      setUseSupabaseData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check demo credentials
      const user = demoCredentials.find(
        cred => cred.email === formData.email && cred.password === formData.password
      );

      if (user) {
        // Create demo session with enhanced data source info
        const demoSession = {
          user: {
            id: user.userId,
            email: user.email,
            user_metadata: {
              full_name: user.name,
              role: user.role,
              data_source: supabaseConnected ? 'supabase' : 'mock'
            }
          },
          access_token: 'demo-token',
          expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        // Store in localStorage for demo purposes
        localStorage.setItem('demo_session', JSON.stringify(demoSession));
        localStorage.setItem('demo_user', JSON.stringify(demoSession.user));
        localStorage.setItem('demo_data_source', supabaseConnected ? 'supabase' : 'mock');

        // Navigate to appropriate dashboard
        if (portalType === 'employee') {
          // For employees, use the company parameter to load specific employee data
          const employeeMap = {
            'techflow-emp-001': 'techflow-sarah',
            'techflow-emp-002': 'techflow-michael',
            'techflow-emp-003': 'techflow-emma',
            'techflow-emp-004': 'techflow-james',
            'techflow-emp-005': 'techflow-alex',
            'techflow-emp-006': 'techflow-lisa',
            'techflow-emp-007': 'techflow-david'
          };
          const companyParam = employeeMap[user.userId] || 'techflow-sarah';
          navigate(`${config.dashboardPath}?company=${companyParam}&source=${supabaseConnected ? 'supabase' : 'mock'}`);
        } else {
          navigate(`${config.dashboardPath}?source=${supabaseConnected ? 'supabase' : 'mock'}`);
        }
      } else {
        setError('Invalid email or password. Please check the demo credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fillDemoCredentials = (credentialIndex = 0) => {
    const credentials = demoCredentials[credentialIndex];
    if (credentials) {
      setFormData({
        email: credentials.email,
        password: credentials.password
      });
    }
  };

  const toggleDataSource = () => {
    setUseSupabaseData(!useSupabaseData);
    setDemoCredentials(useSupabaseData ? fallbackCredentials[portalType] : demoCredentials);
  };

  // Google OAuth sign-in
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?portal=${portalType}`
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        setError('Google sign-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 bg-${config.color}-600 rounded-full flex items-center justify-center`}>
            <IconComponent className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">MXDriveIQ</h2>
          <p className="mt-2 text-lg font-medium text-gray-700">{config.title}</p>
          <p className="text-sm text-gray-500">{config.subtitle}</p>
        </div>

        {/* Google Sign-In */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : `Sign in with Google`}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or use demo credentials</span>
            </div>
          </div>
        </div>

        {/* Demo Environment Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-900">Demo Environment</h3>
          </div>
          <p className="text-sm text-blue-800">
            This is a demonstration environment with sample data from TechFlow Solutions.
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-${config.color}-600 hover:bg-${config.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${config.color}-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                `Sign in to ${config.title}`
              )}
            </button>
          </div>

        </form>

        {/* Portal Navigation */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 text-center mb-4">Switch Portal:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/employee/login')}
              className={`p-2 text-xs rounded-lg border ${portalType === 'employee' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
            >
              Employee
            </button>
            <button
              onClick={() => navigate('/employer/login')}
              className={`p-2 text-xs rounded-lg border ${portalType === 'employer' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
            >
              Employer
            </button>
            <button
              onClick={() => navigate('/mxdealer/login')}
              className={`p-2 text-xs rounded-lg border ${portalType === 'mxdealer' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
            >
              MXDealer
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className={`p-2 text-xs rounded-lg border ${portalType === 'admin' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDemoLogin;
