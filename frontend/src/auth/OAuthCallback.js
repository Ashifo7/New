// src/pages/OAuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        // Save token
        localStorage.setItem('token', token);

        // ✅ Now fetch user profile
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = res.data;

          // Store user info locally if needed
          localStorage.setItem('user', JSON.stringify(user));

          // 🔁 Redirect based on profile status
          if (!user.profileComplete) {
            navigate('/complete-profile');
          } else {
            navigate('/landing'); // ✅ Or your actual dashboard
          }
        } catch (err) {
          console.error('Failed to fetch user profile', err);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 grid-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-300 font-body">Signing you in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
