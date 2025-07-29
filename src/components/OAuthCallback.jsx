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
      // Get the hash fragment from the URL
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken) {
        // Set the session with the tokens
        const { data: { user }, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (error) {
          console.error('Error setting session:', error);
          setError('Authentication failed. Please try again.');
          return;
        }

        if (user) {
          // Check if user has a profile to determine portal type
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('portal_type')
            .eq('user_id', user.id)
            .single();

          // Determine redirect based on email domain or profile
          let redirectPath = '/employee/dashboard'; // default

          if (profile?.portal_type) {
            redirectPath = `/${profile.portal_type}/dashboard`;
          } else if (user.email) {
            // Auto-assign based on email domain
            const domain = user.email.split('@')[1];
            
            if (domain === 'mxdealeradvantage.com.au' || domain === 'millarx.com.au') {
              redirectPath = '/admin/dashboard';
            } else {
              // Default to employee portal for other domains
              redirectPath = '/employee/dashboard';
              
              // Create a basic profile for the user
              await supabase
                .from('user_profiles')
                .upsert({
                  user_id: user.id,
                  email: user.email,
                  full_name: user.user_metadata?.full_name || user.email.split('@')[0],
                  portal_type: 'employee',
                  created_at: new Date().toISOString()
                });
            }
          }

          // Clear the hash from URL and redirect
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate(redirectPath, { replace: true });
        }
      } else {
        setError('No authentication token found.');
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
