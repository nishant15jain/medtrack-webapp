import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../api/authApi';
import { 
  setAuthData, 
  clearAuthData, 
  getToken, 
  getUserRole,
  getUserId,
  isAuthenticated as checkAuth,
  isTokenExpired,
  extractUserIdFromToken 
} from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = () => {
      const token = getToken();
      const role = getUserRole();
      let userId = getUserId();
      const name = localStorage.getItem('userName');
      const email = localStorage.getItem('userEmail');

      // If userId is not in storage, extract it from token
      if (token && !userId) {
        userId = extractUserIdFromToken(token);
        if (userId) {
          // Store it for future use
          setAuthData(token, role, userId);
        }
      }

      if (token && !isTokenExpired(token) && role) {
        setUser({
          token,
          role,
          userId,
          name,
          email
        });
      } else {
        clearAuthData();
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => loginApi(email, password),
    onSuccess: (data) => {
      const { token, role, name, email } = data;
      
      // Extract userId from token
      const userId = extractUserIdFromToken(token);
      
      // Store auth data
      setAuthData(token, role, userId);
      
      // Store user info in localStorage
      if (name) localStorage.setItem('userName', name);
      if (email) localStorage.setItem('userEmail', email);
      
      // Set user state
      setUser({
        token,
        role,
        userId,
        name,
        email
      });

      // Redirect to dashboard
      navigate('/dashboard');
    }
  });

  // Login function
  const login = async (email, password) => {
    return loginMutation.mutateAsync({ email, password });
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setUser(null);
    navigate('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return checkAuth() && user !== null;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    hasRole,
    hasAnyRole,
    loginMutation
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

