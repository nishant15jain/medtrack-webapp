import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctorById, createDoctor, updateDoctor } from '../../api/doctorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './DoctorForm.css';

const DoctorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    hospital: '',
    phone: ''
  });

  // Fetch doctor for edit mode
  const { data: doctor, isLoading: isFetchingDoctor } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => getDoctorById(id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        specialty: doctor.specialty || '',
        hospital: doctor.hospital || '',
        phone: doctor.phone || ''
      });
    }
  }, [doctor]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: (data) => isEditMode ? updateDoctor(id, data) : createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctors']);
      if (isEditMode) {
        queryClient.invalidateQueries(['doctor', id]);
      }
      navigate('/doctors');
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
    navigate('/doctors');
  };

  if (isFetchingDoctor) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</h1>
          <p className="page-description">
            {isEditMode ? 'Update doctor information' : 'Enter doctor details'}
          </p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="doctor-form">
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error?.response?.data?.message || 'Failed to save doctor'}
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
                placeholder="Dr. John Smith"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialty" className="form-label">
                Specialty <span className="required">*</span>
              </label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                className="form-input"
                placeholder="Cardiology"
                value={formData.specialty}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hospital" className="form-label">
                Hospital <span className="required">*</span>
              </label>
              <input
                type="text"
                id="hospital"
                name="hospital"
                className="form-input"
                placeholder="City General Hospital"
                value={formData.hospital}
                onChange={handleChange}
                required
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
                isEditMode ? 'Update Doctor' : 'Add Doctor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;

