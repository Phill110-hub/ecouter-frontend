import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PostLogin() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();

  useEffect(() => {
    console.log("🔄 PostLogin mounted");

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    fetch(`${API_URL}/api/session`, { credentials: 'include' })
      .then(res => {
        console.log("🛰️ /api/session response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("📦 Session data:", data);

        if (data && data.email) {
          setIsAuthenticated(true);
          setUser(data);
          console.log("✅ Auth success, redirecting...");

          if (data.first_login) {
            navigate('/welcome');
          } else {
            navigate('/dashboard');
          }
        } else {
          console.warn("❌ Invalid session, redirecting to /login");
          navigate('/login');
        }
      })
      .catch(err => {
        console.error("🚫 Fetch error:", err);
        navigate('/login');
      });
  }, [navigate, setIsAuthenticated, setUser]);

  return <div>Redirecting...</div>;
}

export default PostLogin;
