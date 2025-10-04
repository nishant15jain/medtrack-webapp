import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSampleById, issueSample, updateSample } from '../../api/sampleApi';
import { getAllDoctors } from '../../api/doctorApi';
import { getAllProducts } from '../../api/productApi';
import { getAllVisits } from '../../api/visitApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorForm.css';

const SampleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  const visitIdFromUrl = searchParams.get('visitId');

  const [formData, setFormData] = useState({
    doctorId: '',
    productId: '',
    quantity: '',
    dateIssued: new Date().toISOString().split('T')[0],
    visitId: visitIdFromUrl || ''
  });

  // Fetch all required data
  const { data: doctors, isLoading: isDoctorsLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: getAllDoctors,
  });

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  const { data: visits, isLoading: isVisitsLoading } = useQuery({
    queryKey: ['visits'],
    queryFn: getAllVisits,
  });

  const { data: sample, isLoading: isFetchingSample } = useQuery({
    queryKey: ['sample', id],
    queryFn: () => getSampleById(id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (sample) {
      setFormData({
        doctorId: sample.doctor?.id || '',
        productId: sample.product?.id || '',
        quantity: sample.quantity || '',
        dateIssued: sample.dateIssued || '',
        visitId: sample.visit?.id || ''
      });
    }
  }, [sample]);

  // Auto-fill doctor when visit is selected
  useEffect(() => {
    if (formData.visitId && visits) {
      const visitId = formData.visitId === '' ? null : parseInt(formData.visitId);
      const selectedVisit = visits.find(v => v.id === visitId);
      
      if (selectedVisit && selectedVisit.doctorId) {
        // Visit DTO has doctorId directly, not a nested doctor object
        setFormData(prev => ({
          ...prev,
          doctorId: String(selectedVisit.doctorId) // Convert to string for select input
        }));
      }
    } else if (!formData.visitId) {
      // Clear doctor when visit is deselected (unless in edit mode)
      if (!isEditMode) {
        setFormData(prev => ({
          ...prev,
          doctorId: ''
        }));
      }
    }
  }, [formData.visitId, visits, isEditMode]);

  const mutation = useMutation({
    mutationFn: (data) => isEditMode ? updateSample(id, data) : issueSample(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['samples']);
      if (isEditMode) {
        queryClient.invalidateQueries(['sample', id]);
      }
      navigate('/samples');
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
    
    // Validate required fields
    if (!formData.doctorId) {
      console.error('Doctor ID is required');
      return;
    }
    if (!formData.productId) {
      console.error('Product ID is required');
      return;
    }
    
    const submitData = {
      doctorId: parseInt(formData.doctorId),
      productId: parseInt(formData.productId),
      quantity: parseInt(formData.quantity),
      dateIssued: formData.dateIssued,
    };
    
    // Only include visitId if it's set and not empty string
    if (formData.visitId && formData.visitId !== '') {
      submitData.visitId = parseInt(formData.visitId);
    }
    
    console.log('Submitting sample data:', submitData); // Debug log
    mutation.mutate(submitData);
  };

  const handleCancel = () => {
    navigate('/samples');
  };

  if (isFetchingSample || isDoctorsLoading || isProductsLoading || isVisitsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditMode ? 'Edit Sample' : 'Issue New Sample'}</h1>
          <p className="page-description">
            {isEditMode ? 'Update sample information' : 'Record a product sample distribution'}
          </p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="doctor-form">
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error?.response?.data?.message || 'Failed to save sample'}
              onClose={() => mutation.reset()}
            />
          )}

          <div className="form-group">
            <label htmlFor="visitId" className="form-label">
              Associate with Visit (Optional)
            </label>
            <select
              id="visitId"
              name="visitId"
              className="form-input"
              value={formData.visitId}
              onChange={handleChange}
              disabled={mutation.isPending}
            >
              <option value="">Direct sample (not linked to visit)</option>
              {visits?.map((visit) => (
                <option key={visit.id} value={visit.id}>
                  {new Date(visit.visitDate).toLocaleDateString()} - Dr. {visit.doctorName}
                </option>
              ))}
            </select>
          </div>

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
                disabled={mutation.isPending || !!formData.visitId}
                style={{ 
                  backgroundColor: formData.visitId ? '#f3f4f6' : 'white',
                  cursor: formData.visitId ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="">Select a doctor</option>
                {doctors?.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty} - {doctor.hospital}
                  </option>
                ))}
              </select>
              {formData.visitId && (
                <small style={{ color: '#3b82f6', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  ✓ Auto-filled from selected visit
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="productId" className="form-label">
                Product <span className="required">*</span>
              </label>
              <select
                id="productId"
                name="productId"
                className="form-input"
                value={formData.productId}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              >
                <option value="">Select a product</option>
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity" className="form-label">
                Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="form-input"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                disabled={mutation.isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateIssued" className="form-label">
                Date Issued <span className="required">*</span>
              </label>
              <input
                type="date"
                id="dateIssued"
                name="dateIssued"
                className="form-input"
                value={formData.dateIssued}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
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
                isEditMode ? 'Update Sample' : 'Issue Sample'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SampleForm;

