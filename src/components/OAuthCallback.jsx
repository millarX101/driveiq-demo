import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      // Get the portal parameter from URL
      const urlParams = new URLSearchParams(location.search);
      const targetPortal = urlParams.get('portal') || 'employee';

      // Handle the OAuth session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        setError('Authentication failed. Please try again.');
        return;
      }

      const { session } = data;
      if (session?.user) {
        const user = session.user;

        // Check if user has portal access for the target portal
        const { data: portalAccess } = await supabase
          .from('portal_access')
          .select('*')
          .eq('user_id', user.id)
          .eq('portal_type', targetPortal)
          .eq('is_active', true)
          .single();

        let redirectPath = `/${targetPortal}/dashboard`;

        if (!portalAccess) {
          // If no portal access exists, create default access based on email domain
          const domain = user.email?.split('@')[1];
          let defaultPortal = targetPortal;
          let permissions = {};

          if (domain === 'mxdealeradvantage.com.au' || domain === 'millarx.com.au') {
            defaultPortal = 'admin';
            permissions = { manage_users: true, manage_rates: true, view_all_data: true };
          } else {
            // Create employee access by default
            permissions = { company_id: 1, employee_id: 1, can_apply: true };
          }

          // Create portal access record
          await supabase
            .from('portal_access')
            .upsert({
              user_id: user.id,
              portal_type: defaultPortal,
              permissions: permissions,
              is_active: true,
              created_at: new Date().toISOString()
            });

          redirectPath = `/${defaultPortal}/dashboard`;
        }

        // Clear the URL and redirect
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate(redirectPath, { replace: true });
      } else {
        setError('No user session found.');
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/employee/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
