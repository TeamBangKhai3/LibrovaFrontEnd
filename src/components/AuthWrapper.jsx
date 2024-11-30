import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PUBLIC_ROUTES = ['/', '/user/login', '/user/register', '/publisher/login', '/publisher/register'];

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const checkAuth = async () => {
      // Allow access to public routes without authentication
      if (PUBLIC_ROUTES.includes(location.pathname)) {
        setIsChecking(false);
        return;
      }

      const token = localStorage.getItem('sessionToken');
      
      if (!token) {
        // If no token and not on a public route, redirect to login
        if (location.pathname.startsWith('/publisher')) {
          navigate('/publisher/login');
        } else {
          navigate('/user/login');
        }
        return;
      }

      try {
        // Check if token is valid
        const endpoint = location.pathname.startsWith('/publisher')
          ? `${backendUrl}/authpublisher/ping`
          : `${backendUrl}/authuser/ping`;

        await axios.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setIsChecking(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('sessionToken');
        
        if (location.pathname.startsWith('/publisher')) {
          navigate('/publisher/login');
        } else {
          navigate('/user/login');
        }
      }
    };

    checkAuth();
  }, [navigate, location.pathname, backendUrl]);

  if (isChecking) {
    return <div>Loading...</div>; 
  }

  return children;
};

export default AuthWrapper;
