import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginMutation } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled by mutation
    }
  };

  const getErrorMessage = () => {
    if (loginMutation.error?.response?.data?.message) {
      return loginMutation.error.response.data.message;
    }
    if (loginMutation.error?.message) {
      return loginMutation.error.message;
    }
    return 'An error occurred during login. Please try again.';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">MedTrack Pro</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {loginMutation.isError && (
            <ErrorMessage 
              message={getErrorMessage()}
              onClose={() => loginMutation.reset()}
            />
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loginMutation.isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loginMutation.isPending}
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <span className="btn-loading">
                <LoadingSpinner size="small" />
                <span>Signing in...</span>
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="login-footer">
            <p className="login-footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="login-link">
                Register as Admin
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

