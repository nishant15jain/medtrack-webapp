import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVisitById, createVisit, updateVisit } from '../../api/visitApi';
import { getAllDoctors } from '../../api/doctorApi';
import { useAuth } from '../../context/AuthContext';
import { getUserId } from '../../utils/auth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorForm.css';

const VisitForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    userId: '',
    doctorId: '',
    visitDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Set userId from auth on mount
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      setFormData(prev => ({
        ...prev,
        userId: userId
      }));
    }
  }, []);

  // Fetch doctors for dropdown
  const { data: doctors, isLoading: isDoctorsLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: getAllDoctors,
  });

  // Fetch visit for edit mode
  const { data: visit, isLoading: isFetchingVisit } = useQuery({
    queryKey: ['visit', id],
    queryFn: () => getVisitById(id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (visit) {
      setFormData({
        userId: visit.user?.id || getUserId(),
        doctorId: visit.doctor?.id || '',
        visitDate: visit.visitDate || '',
        notes: visit.notes || ''
      });
    }
  }, [visit]);

  const mutation = useMutation({
    mutationFn: (data) => isEditMode ? updateVisit(id, data) : createVisit(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['visits']);
      if (isEditMode) {
        queryClient.invalidateQueries(['visit', id]);
      }
      navigate('/visits');
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
    
    // Validate userId exists
    if (!formData.userId) {
      console.error('User ID is missing');
      return;
    }
    
    mutation.mutate({
      userId: parseInt(formData.userId),
      doctorId: parseInt(formData.doctorId),
      visitDate: formData.visitDate,
      notes: formData.notes || null
    });
  };

  const handleCancel = () => {
    navigate('/visits');
  };

  if (isFetchingVisit || isDoctorsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditMode ? 'Edit Visit' : 'Log New Visit'}</h1>
          <p className="page-description">
            {isEditMode ? 'Update visit information' : 'Record a doctor visit'}
          </p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="doctor-form">
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error?.response?.data?.message || 'Failed to save visit'}
              onClose={() => mutation.reset()}
            />
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="doctorId" className="form-label">
                Doctor <span className="required">*</span>
              </label>
              <select
                id="doctorId"
                name="doctorId"
                className="form-input"
                value={formData.doctorId}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              >
                <option value="">Select a doctor</option>
                {doctors?.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty} ({doctor.hospital})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="visitDate" className="form-label">
                Visit Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="visitDate"
                name="visitDate"
                className="form-input"
                value={formData.visitDate}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Visit Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-textarea"
              placeholder="Enter visit details, discussion points, outcomes..."
              value={formData.notes}
              onChange={handleChange}
              rows="6"
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
                  <span>Saving...</span>
                </span>
              ) : (
                isEditMode ? 'Update Visit' : 'Log Visit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitForm;

