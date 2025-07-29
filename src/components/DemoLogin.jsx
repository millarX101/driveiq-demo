import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Building2, Users, Car, Shield } from 'lucide-react';

const DemoLogin = ({ portalType = 'employee' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Demo credentials for TechFlow Solutions
  const demoCredentials = {
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
      { email: 'hr@techflowsolutions.com.au', password: 'admin123', name: 'Jennifer Walsh', userId: 'techflow-hr-001' }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check demo credentials
      const validCredentials = demoCredentials[portalType];
      const user = validCredentials.find(
        cred => cred.email === formData.email && cred.password === formData.password
      );

      if (user) {
        // Create demo session
        const demoSession = {
          user: {
            id: user.userId,
            email: user.email,
            user_metadata: {
              full_name: user.name
            }
          },
          access_token: 'demo-token',
          expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        // Store in localStorage for demo purposes
        localStorage.setItem('demo_session', JSON.stringify(demoSession));
        localStorage.setItem('demo_user', JSON.stringify(demoSession.user));

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
          const companyParam = employeeMap[user.userId];
          navigate(`${config.dashboardPath}?company=${companyParam}`);
        } else {
          navigate(config.dashboardPath);
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
    const credentials = demoCredentials[portalType][credentialIndex];
    if (credentials) {
      setFormData({
        email: credentials.email,
        password: credentials.password
      });
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

        {/* Demo Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {demoCredentials[portalType].map((cred, index) => (
              <div key={index} className="text-xs text-blue-800">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials(index)}
                  className="hover:underline text-left w-full"
                >
                  <strong>{cred.name}:</strong> {cred.email} / {cred.password}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-2">Click any credential above to auto-fill</p>
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

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Demo environment - Use credentials above for testing
            </p>
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

export default DemoLogin;
