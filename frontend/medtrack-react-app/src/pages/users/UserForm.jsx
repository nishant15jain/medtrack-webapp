import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../../api/userApi';
import { USER_ROLES, ROLE_DESCRIPTIONS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorForm.css';

const UserForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: USER_ROLES.REP
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      navigate('/users');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New User</h1>
          <p className="page-description">Create a new system user</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="doctor-form">
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error?.response?.data?.message || 'Failed to create user'}
              onClose={() => mutation.reset()}
            />
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={mutation.isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Role <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={mutation.isPending}
            >
              {Object.values(USER_ROLES).map((role) => (
                <option key={role} value={role}>
                  {role} - {ROLE_DESCRIPTIONS[role]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <span className="btn-loading">
                  <LoadingSpinner size="small" />
                  <span>Creating...</span>
                </span>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;

