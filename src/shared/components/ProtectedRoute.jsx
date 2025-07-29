import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, portalType }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAccess();
  }, [portalType]);

  const checkAccess = async () => {
    try {
      // Check for demo user first
      const demoUser = localStorage.getItem('demo_user');
      const demoSession = localStorage.getItem('demo_session');
      
      if (demoUser && demoSession) {
        const parsedDemoUser = JSON.parse(demoUser);
        const parsedDemoSession = JSON.parse(demoSession);
        
        // Check if demo session is still valid
        if (parsedDemoSession.expires_at > Date.now()) {
          // For demo users, determine portal access based on user ID pattern
          const userId = parsedDemoUser.id;
          let hasPortalAccess = false;
          
          if (portalType === 'employee' && userId.includes('emp-')) {
            hasPortalAccess = true;
          } else if (portalType === 'employer' && userId.includes('hr-')) {
            hasPortalAccess = true;
          } else if (portalType === 'mxdealer' && userId.includes('mxdealer-')) {
            hasPortalAccess = true;
          } else if (portalType === 'admin' && userId.includes('admin-')) {
            hasPortalAccess = true;
          }
          
          if (hasPortalAccess) {
            setUser(parsedDemoUser);
            setHasAccess(true);
            setLoading(false);
            return;
          }
        } else {
          // Demo session expired, clear it
          localStorage.removeItem('demo_user');
          localStorage.removeItem('demo_session');
        }
      }

      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }

      setUser(session.user);

      // Check portal access
      const { data: access, error } = await supabase
        .from('portal_access')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('portal_type', portalType)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Access check error:', error);
        setHasAccess(false);
      } else if (access) {
        setHasAccess(true);
      } else {
        // For demo purposes, allow access if no portal_access record exists
        // In production, this should be false
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to appropriate login page
    const loginPath = `/${portalType}/login`;
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    // Redirect to unauthorized page or main landing
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
