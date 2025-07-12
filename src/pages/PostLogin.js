import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from './axios'; // ✅ Use axios instance

function PostLogin() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();

  useEffect(() => {
    console.log("🔄 PostLogin mounted");

    api.get('/api/session')
      .then(res => {
        const data = res.data;
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
        console.error("🚫 API error:", err);
        navigate('/login');
      });
  }, [navigate, setIsAuthenticated, setUser]);

  return <div>Redirecting...</div>;
}

export default PostLogin;
