import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser, getUserById } from '../../api/userApi';
import { getActiveLocations } from '../../api/locationApi';
import { USER_ROLES, ROLE_DESCRIPTIONS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorForm.css';
import './UserForm.css';

const UserForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: USER_ROLES.REP,
    locationIds: []
  });

  // Fetch existing user data if in edit mode
  const { data: existingUser, isLoading: userLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: isEditMode,
  });

  // Populate form with existing user data
  useEffect(() => {
    if (existingUser && isEditMode) {
      setFormData({
        name: existingUser.name || '',
        email: existingUser.email || '',
        password: '', // Don't populate password in edit mode
        phone: existingUser.phone || '',
        role: existingUser.role || USER_ROLES.REP,
        locationIds: existingUser.locationIds || []
      });
    }
  }, [existingUser, isEditMode]);

  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations', 'active'],
    queryFn: getActiveLocations,
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEditMode) {
        // In edit mode, only send fields that should be updated
        const updateData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          locationIds: data.locationIds
        };
        // Only include password if it was changed
        if (data.password && data.password.trim() !== '') {
          updateData.password = data.password;
        }
        return updateUser(id, updateData);
      } else {
        return createUser(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', id]);
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

  const handleLocationToggle = (locationId) => {
    setFormData(prev => {
      const currentIds = prev.locationIds || [];
      const isSelected = currentIds.includes(locationId);
      
      return {
        ...prev,
        locationIds: isSelected
          ? currentIds.filter(id => id !== locationId)
          : [...currentIds, locationId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate('/users');
  };

  // Show loading spinner while fetching user data in edit mode
  if (isEditMode && userLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEditMode ? 'Edit User' : 'Add New User'}
          </h1>
          <p className="page-description">
            {isEditMode ? 'Update user information and assigned locations' : 'Create a new system user'}
          </p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="doctor-form">
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} user`}
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
                Password {!isEditMode && <span className="required">*</span>}
                {isEditMode && <span className="form-help-text"> (leave blank to keep current)</span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
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

          <div className="form-group">
            <label className="form-label">
              Assign Locations {formData.role === USER_ROLES.REP && <span className="required">*</span>}
            </label>
            
            {locationsLoading ? (
              <div className="locations-loading">
                <LoadingSpinner size="small" />
                <span>Loading locations...</span>
              </div>
            ) : locations && locations.length > 0 ? (
              <div className="locations-checkbox-container">
                <div className="locations-checkbox-list">
                  {locations.map((location) => (
                    <label 
                      key={location.id} 
                      className={`location-checkbox-item ${formData.locationIds.includes(location.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.locationIds.includes(location.id)}
                        onChange={() => handleLocationToggle(location.id)}
                        disabled={mutation.isPending}
                        className="location-checkbox"
                      />
                      <div className="location-info">
                        <span className="location-name">📍 {location.name} {location.city}{location.state ? `, ${location.state}` : ''}</span>
                        {/* <span className="location-city">{location.city}{location.state ? `, ${location.state}` : ''}</span> */}
                      </div>
                      {formData.locationIds.includes(location.id) && (
                        <span className="check-icon">✓</span>
                      )}
                    </label>
                  ))}
                </div>
                {formData.locationIds.length > 0 && (
                  <div className="selected-count">
                    <strong>{formData.locationIds.length}</strong> location(s) selected
                  </div>
                )}
              </div>
            ) : (
              <div className="no-locations-message">
                <p>No active locations available</p>
              </div>
            )}
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
                  <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                </span>
              ) : (
                isEditMode ? 'Update User' : 'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;

