import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBulkLocations } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorForm.css';

const BulkLocationForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [locations, setLocations] = useState([
    {
      name: '',
      city: '',
      state: '',
      country: 'India',
      address: ''
    }
  ]);

  const mutation = useMutation({
    mutationFn: (data) => createBulkLocations(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['locations']);
      navigate('/locations');
    },
  });

  const addLocation = () => {
    setLocations(prev => [...prev, {
      name: '',
      city: '',
      state: '',
      country: 'India',
      address: ''
    }]);
  };

  const removeLocation = (index) => {
    if (locations.length > 1) {
      setLocations(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleLocationChange = (index, field, value) => {
    setLocations(prev => prev.map((location, i) => 
      i === index ? { ...location, [field]: value } : location
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty locations (where name and city are both empty)
    const validLocations = locations.filter(location => 
      location.name.trim() && location.city.trim()
    );

    if (validLocations.length === 0) {
      alert('Please add at least one valid location with name and city.');
      return;
    }

    mutation.mutate(validLocations);
  };

  const handleCancel = () => {
    navigate('/locations');
  };

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Multiple Locations</h1>
          <p className="page-description">
            Add multiple locations at once. You can assign them to users later.
          </p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="doctor-form">
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error?.response?.data?.message || 'Failed to save locations'}
              onClose={() => mutation.reset()}
            />
          )}

          <div className="bulk-form-header">
            <h3>Locations to Add ({locations.length})</h3>
            <button
              type="button"
              className="btn-primary btn-small"
              onClick={addLocation}
              disabled={mutation.isPending || locations.length >= 10}
            >
              + Add Another Location
            </button>
          </div>

          <div className="bulk-locations-container">
            {locations.map((location, index) => (
              <div key={index} className="bulk-location-item">
                <div className="bulk-location-header">
                  <h4>Location {index + 1}</h4>
                  {locations.length > 1 && (
                    <button
                      type="button"
                      className="btn-icon btn-remove"
                      onClick={() => removeLocation(index)}
                      disabled={mutation.isPending}
                      title="Remove this location"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`name-${index}`} className="form-label">
                      Location Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id={`name-${index}`}
                      className="form-input"
                      placeholder="e.g., City Hospital, Downtown Clinic"
                      value={location.name}
                      onChange={(e) => handleLocationChange(index, 'name', e.target.value)}
                      required
                      disabled={mutation.isPending}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`city-${index}`} className="form-label">
                      City <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id={`city-${index}`}
                      className="form-input"
                      placeholder="e.g., Mumbai, Delhi"
                      value={location.city}
                      onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                      required
                      disabled={mutation.isPending}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`state-${index}`} className="form-label">
                      State
                    </label>
                    <input
                      type="text"
                      id={`state-${index}`}
                      className="form-input"
                      placeholder="e.g., Maharashtra, Delhi"
                      value={location.state}
                      onChange={(e) => handleLocationChange(index, 'state', e.target.value)}
                      disabled={mutation.isPending}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`country-${index}`} className="form-label">
                      Country <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id={`country-${index}`}
                      className="form-input"
                      placeholder="e.g., India"
                      value={location.country}
                      onChange={(e) => handleLocationChange(index, 'country', e.target.value)}
                      required
                      disabled={mutation.isPending}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor={`address-${index}`} className="form-label">
                    Address
                  </label>
                  <textarea
                    id={`address-${index}`}
                    className="form-input"
                    rows="2"
                    placeholder="Enter full address..."
                    value={location.address}
                    onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                    disabled={mutation.isPending}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-primary"
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
                  <span>Creating Locations...</span>
                </span>
              ) : (
                `Create ${locations.filter(l => l.name.trim() && l.city.trim()).length} Location(s)`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkLocationForm;
