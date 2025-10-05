import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { startVisit, getActiveVisitsByUser } from '../../api/visitApi';
import { getUserLocations } from '../../api/locationApi';
import { getAllDoctors } from '../../api/doctorApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorForm.css';

const VisitStartForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    userId: user?.userId || '',
    locationId: '',
    doctorId: '',
    notes: ''
  });

  // Check for active visits
  const { data: activeVisits } = useQuery({
    queryKey: ['activeVisits', user?.userId],
    queryFn: () => getActiveVisitsByUser(user?.userId),
    enabled: !!user?.userId,
  });

  // Get user's assigned locations
  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ['userLocations', user?.userId],
    queryFn: () => getUserLocations(user?.userId),
    enabled: !!user?.userId,
  });

  // Get all doctors
  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: getAllDoctors,
  });

  const mutation = useMutation({
    mutationFn: startVisit,
    onSuccess: () => {
      queryClient.invalidateQueries(['visits']);
      queryClient.invalidateQueries(['activeVisits']);
      navigate('/visits');
    },
  });

  useEffect(() => {
    if (user?.userId) {
      setFormData(prev => ({
        ...prev,
        userId: user.userId
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      locationId: Number(formData.locationId),
      doctorId: Number(formData.doctorId),
      userId: Number(formData.userId)
    });
  };

  const handleCancel = () => {
    navigate('/visits');
  };

  // Check if user has an active visit
  const hasActiveVisit = activeVisits && activeVisits.length > 0;

  if (locationsLoading || doctorsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Start New Visit</h1>
          <p className="page-description">Select location and doctor to begin visit</p>
        </div>
      </div>

      <div className="form-container">
        {hasActiveVisit && (
          <div className="alert alert-warning">
            <strong>⚠️ Active Visit Found:</strong> You currently have an active visit. 
            Please complete it before starting a new one.
            <button 
              className="btn-link" 
              onClick={() => navigate('/visits')}
            >
              View Active Visit
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="doctor-form">
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error?.response?.data?.message || 'Failed to start visit'}
              onClose={() => mutation.reset()}
            />
          )}

          <div className="form-group">
            <label htmlFor="locationId" className="form-label">
              Select Location <span className="required">*</span>
            </label>
            <select
              id="locationId"
              name="locationId"
              className="form-input"
              value={formData.locationId}
              onChange={handleChange}
              required
              disabled={mutation.isPending || hasActiveVisit}
            >
              <option value="">-- Choose a location --</option>
              {locations && locations.length > 0 ? (
                locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name} - {location.city}
                  </option>
                ))
              ) : (
                <option disabled>No locations assigned to you</option>
              )}
            </select>
            {(!locations || locations.length === 0) && (
              <small className="form-help-text error-text">
                No locations are assigned to your account. Please contact your administrator.
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="doctorId" className="form-label">
              Select Doctor <span className="required">*</span>
            </label>
            <select
              id="doctorId"
              name="doctorId"
              className="form-input"
              value={formData.doctorId}
              onChange={handleChange}
              required
              disabled={mutation.isPending || hasActiveVisit}
            >
              <option value="">-- Choose a doctor --</option>
              {doctors && doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))
              ) : (
                <option disabled>No doctors available</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Initial Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-input"
              rows="4"
              placeholder="Add any initial notes about this visit..."
              value={formData.notes}
              onChange={handleChange}
              disabled={mutation.isPending || hasActiveVisit}
            />
          </div>

          <div className="visit-info-box">
            <h4>📍 Visit Information</h4>
            <p>• Check-in time will be recorded automatically when you start the visit</p>
            <p>• You can end the visit and add notes when you're done</p>
            <p>• Only one visit can be active at a time</p>
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
              disabled={mutation.isPending || hasActiveVisit || !locations || locations.length === 0}
            >
              {mutation.isPending ? (
                <span className="btn-loading">
                  <LoadingSpinner size="small" />
                  <span>Starting Visit...</span>
                </span>
              ) : (
                '▶️ Start Visit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitStartForm;

