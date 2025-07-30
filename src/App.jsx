import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './supabaseClient';

// Main Landing Pages
import LandingPage from './LandingPage';
import Confirmation from './Confirmation';
import EmployeeForm from './EmployeeForm';

// Employee Portal
import EmployeeLanding from './portals/employee/EmployeeLanding';
import EmployeeLogin from './portals/employee/EmployeeLogin';
import EmployeeDashboard from './portals/employee/EmployeeDashboard';

// Employer Portal
import EmployerLanding from './portals/employer/EmployerLanding';
import EmployerLogin from './portals/employer/EmployerLogin';
import EmployerDashboard from './portals/employer/EmployerDashboard';

// MXDealer Portal
import MXDealerLanding from './portals/mxdealer/MXDealerLanding';
import MXDealerLogin from './portals/mxdealer/MXDealerLogin';
import MXDealerDashboardImproved from './portals/mxdealer/MXDealerDashboardImproved';
import MXIntegratedPlatform from './components/MXIntegratedPlatform';

// Admin Portal
import AdminLogin from './portals/admin/AdminLogin';
import AdminDashboard from './portals/admin/AdminDashboard';

// Shared Components
import ProtectedRoute from './shared/components/ProtectedRoute';

// Legacy Components (for backward compatibility)
import Login from './Login';
import Protected from './Protected';
import Dashboard from './components/Dashboard';

// Existing employee components (moved to new structure)
import EmployeeLoginLegacy from './components/EmployeeLogin';
import EmployeeDashboardLegacy from './components/EmployeeDashboard';

// OAuth Callback Handler
import OAuthCallback from './components/OAuthCallback';

// OAuth Redirect Handler Component
const OAuthRedirectHandler = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if URL contains OAuth tokens in hash
    if (location.hash && location.hash.includes('access_token=')) {
      // This is an OAuth callback, render the callback handler
      return;
    }
  }, [location]);

  // If URL contains OAuth tokens, show callback handler
  if (location.hash && location.hash.includes('access_token=')) {
    return <OAuthCallback />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <OAuthRedirectHandler>
          <Routes>
          {/* Main Landing and Form Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/form" element={<EmployeeForm />} />
          <Route path="/thanks" element={<Confirmation />} />

          {/* Employee Portal Routes */}
          <Route path="/employee" element={<EmployeeLanding />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute portalType="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Employer Portal Routes */}
          <Route path="/employer" element={<EmployerLanding />} />
          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route 
            path="/employer/dashboard" 
            element={
              <ProtectedRoute portalType="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* MXDealer Portal Routes */}
          <Route path="/mxdealer" element={<MXDealerLanding />} />
          <Route path="/mxdealer/login" element={<MXDealerLogin />} />
          <Route 
            path="/mxdealer/dashboard" 
            element={
              <ProtectedRoute portalType="mxdealer">
                <MXDealerDashboardImproved />
              </ProtectedRoute>
            } 
          />
          <Route path="/mxdealer/calculator" element={<Navigate to="/mxdealer/dashboard?tab=calculator" replace />} />
          <Route path="/mxdealer/integrated" element={<MXIntegratedPlatform />} />

          {/* Admin Portal Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute portalType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute portalType="admin">
                <AdminDashboard defaultTab="users" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/quotes" 
            element={
              <ProtectedRoute portalType="admin">
                <AdminDashboard defaultTab="quotes" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/applications" 
            element={
              <ProtectedRoute portalType="admin">
                <AdminDashboard defaultTab="applications" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/rates" 
            element={
              <ProtectedRoute portalType="admin">
                <AdminDashboard defaultTab="rates" />
              </ProtectedRoute>
            } 
          />

          {/* OAuth Callback Route */}
          <Route path="/auth/callback" element={<OAuthCallback />} />

          {/* Legacy Routes (for backward compatibility) */}
          <Route path="/login" element={<Login />} />
          <Route path="/protected" element={<Protected />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Legacy employee routes - redirect to new structure */}
          <Route path="/employee-login" element={<Navigate to="/employee/login" replace />} />
          <Route path="/employee-dashboard" element={<Navigate to="/employee/dashboard" replace />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </OAuthRedirectHandler>
      </div>
    </Router>
  );
}

export default App;
