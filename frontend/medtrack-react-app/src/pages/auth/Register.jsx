import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../api/authApi';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (data) => register(data),
    onSuccess: () => {
      // Redirect to login after successful registration
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' }
      });
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await registerMutation.mutateAsync(formData);
    } catch (error) {
      // Error is handled by mutation
    }
  };

  const getErrorMessage = () => {
    // Check for error message in response data (backend format: {error: "..."} or {message: "..."})
    if (registerMutation.error?.response?.data?.error) {
      return registerMutation.error.response.data.error;
    }
    if (registerMutation.error?.response?.data?.message) {
      return registerMutation.error.response.data.message;
    }
    if (registerMutation.error?.message) {
      return registerMutation.error.message;
    }
    return 'An error occurred during registration. Please try again.';
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">MedTrack Pro</h1>
          <p className="register-subtitle">Create your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {registerMutation.isError && (
            <ErrorMessage 
              message={getErrorMessage()}
              onClose={() => registerMutation.reset()}
            />
          )}

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={registerMutation.isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              disabled={registerMutation.isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              disabled={registerMutation.isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={registerMutation.isPending}
            />
          </div>

          <div className="register-info">
            <p className="register-info-text">
              ℹ️ You will be registered as an ADMIN user with full access to the system.
            </p>
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <span className="btn-loading">
                <LoadingSpinner size="small" />
                <span>Creating account...</span>
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="register-footer">
            <p className="register-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="register-link">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

