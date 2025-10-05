import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLocation, updateLocation, getLocationById } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorForm.css';

const LocationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    country: 'India',
    address: ''
  });

  const { data: location, isLoading: isLoadingLocation } = useQuery({
    queryKey: ['location', id],
    queryFn: () => getLocationById(id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        city: location.city || '',
        state: location.state || '',
        country: location.country || 'India',
        address: location.address || ''
      });
    }
  }, [location]);

  const mutation = useMutation({
    mutationFn: (data) => 
      isEditMode ? updateLocation(id, data) : createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['locations']);
      navigate('/locations');
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
    navigate('/locations');
  };

  if (isEditMode && isLoadingLocation) {
    return <LoadingSpinner />;
  }

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEditMode ? 'Edit Location' : 'Add New Location'}
          </h1>
          <p className="page-description">
            {isEditMode ? 'Update location information' : 'Create a new location'}
          </p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="doctor-form">
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error?.response?.data?.message || 'Failed to save location'}
              onClose={() => mutation.reset()}
            />
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Location Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="e.g., City Hospital, Downtown Clinic"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city" className="form-label">
                City <span className="required">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="form-input"
                placeholder="e.g., Mumbai, Delhi"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="state" className="form-label">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                className="form-input"
                placeholder="e.g., Maharashtra, Delhi"
                value={formData.state}
                onChange={handleChange}
                disabled={mutation.isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country" className="form-label">
                Country <span className="required">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className="form-input"
                placeholder="e.g., India"
                value={formData.country}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              className="form-input"
              rows="3"
              placeholder="Enter full address..."
              value={formData.address}
              onChange={handleChange}
              disabled={mutation.isPending}
            />
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
                isEditMode ? 'Update Location' : 'Create Location'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;

