import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductById, createProduct, updateProduct } from '../../api/productApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorForm.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    manufacturer: '',
    description: ''
  });

  const { data: product, isLoading: isFetchingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        manufacturer: product.manufacturer || '',
        description: product.description || ''
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: (data) => isEditMode ? updateProduct(id, data) : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      if (isEditMode) {
        queryClient.invalidateQueries(['product', id]);
      }
      navigate('/products');
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
    navigate('/products');
  };

  if (isFetchingProduct) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="page-description">
            {isEditMode ? 'Update product information' : 'Enter product details'}
          </p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="doctor-form">
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error?.response?.data?.message || 'Failed to save product'}
              onClose={() => mutation.reset()}
            />
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Product Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Product X"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                className="form-input"
                placeholder="Antibiotics"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="manufacturer" className="form-label">
              Manufacturer <span className="required">*</span>
            </label>
            <input
              type="text"
              id="manufacturer"
              name="manufacturer"
              className="form-input"
              placeholder="Pharma Corp"
              value={formData.manufacturer}
              onChange={handleChange}
              required
              disabled={mutation.isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Product description and details"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
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
                isEditMode ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

