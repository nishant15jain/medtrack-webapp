import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../../api/orderApi';
import { getAllDoctors } from '../../api/doctorApi';
import { getAllProducts } from '../../api/productApi';
import { getAllVisits } from '../../api/visitApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorForm.css';

const OrderForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const visitIdFromUrl = searchParams.get('visitId');

  const [formData, setFormData] = useState({
    doctorId: '',
    orderDate: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    paymentStatus: 'UNPAID',
    notes: '',
    visitId: visitIdFromUrl || ''
  });

  const [orderItems, setOrderItems] = useState([
    { productId: '', quantity: 1, unitPrice: '', discountPercent: 0 }
  ]);

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

  // Auto-fill doctor when visit is selected
  useEffect(() => {
    if (formData.visitId && visits) {
      const visitId = formData.visitId === '' ? null : parseInt(formData.visitId);
      const selectedVisit = visits.find(v => v.id === visitId);
      
      if (selectedVisit && selectedVisit.doctorId) {
        setFormData(prev => ({
          ...prev,
          doctorId: String(selectedVisit.doctorId)
        }));
      }
    }
  }, [formData.visitId, visits]);

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      navigate('/orders');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    
    // Auto-fill unit price when product is selected
    if (field === 'productId' && value && products) {
      const product = products.find(p => p.id === parseInt(value));
      if (product && product.price) {
        updatedItems[index].unitPrice = product.price;
      }
    }
    
    setOrderItems(updatedItems);
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1, unitPrice: '', discountPercent: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const calculateItemSubtotal = (item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const discount = parseFloat(item.discountPercent) || 0;
    const subtotal = qty * price;
    const discountAmount = subtotal * (discount / 100);
    return (subtotal - discountAmount).toFixed(2);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + parseFloat(calculateItemSubtotal(item));
    }, 0).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.doctorId) {
      alert('Doctor is required');
      return;
    }

    // Validate order items
    const validItems = orderItems.filter(item => 
      item.productId && item.quantity && item.unitPrice
    );

    if (validItems.length === 0) {
      alert('Please add at least one valid order item');
      return;
    }

    const submitData = {
      doctorId: parseInt(formData.doctorId),
      orderDate: formData.orderDate,
      status: formData.status,
      paymentStatus: formData.paymentStatus,
      notes: formData.notes || null,
      orderItems: validItems.map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        discountPercent: parseFloat(item.discountPercent) || 0
      }))
    };
    
    // Only include visitId if it's set
    if (formData.visitId && formData.visitId !== '') {
      submitData.visitId = parseInt(formData.visitId);
    }
    
    mutation.mutate(submitData);
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  if (isDoctorsLoading || isProductsLoading || isVisitsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Order</h1>
          <p className="page-description">Create a product order from a doctor</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="doctor-form">
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error?.response?.data?.message || 'Failed to create order'}
              onClose={() => mutation.reset()}
            />
          )}

          {/* Basic Information */}
          <div className="form-section">
            <h3 className="form-section-title">Order Information</h3>

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
                <option value="">Direct order (not linked to visit)</option>
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
                <label htmlFor="orderDate" className="form-label">
                  Order Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="orderDate"
                  name="orderDate"
                  className="form-input"
                  value={formData.orderDate}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  disabled={mutation.isPending}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Order Status <span className="required">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  disabled={mutation.isPending}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="paymentStatus" className="form-label">
                  Payment Status <span className="required">*</span>
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  className="form-input"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  required
                  disabled={mutation.isPending}
                >
                  <option value="UNPAID">Unpaid</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                className="form-input"
                placeholder="Add any additional notes about this order"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                disabled={mutation.isPending}
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="form-section-title">Order Items</h3>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleAddItem}
                disabled={mutation.isPending}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                + Add Item
              </button>
            </div>

            {orderItems.map((item, index) => (
              <div key={index} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '16px', 
                marginBottom: '16px',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, color: '#374151' }}>Item {index + 1}</h4>
                  {orderItems.length > 1 && (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleRemoveItem(index)}
                      disabled={mutation.isPending}
                      style={{ padding: '4px 12px', fontSize: '12px' }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Product <span className="required">*</span>
                    </label>
                    <select
                      className="form-input"
                      value={item.productId}
                      onChange={(e) => handleOrderItemChange(index, 'productId', e.target.value)}
                      required
                      disabled={mutation.isPending}
                    >
                      <option value="">Select a product</option>
                      {products?.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.category} {product.price ? `(₹${product.price})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Quantity <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Enter quantity"
                      value={item.quantity}
                      onChange={(e) => handleOrderItemChange(index, 'quantity', e.target.value)}
                      required
                      min="1"
                      disabled={mutation.isPending}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Unit Price (₹) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Enter unit price"
                      value={item.unitPrice}
                      onChange={(e) => handleOrderItemChange(index, 'unitPrice', e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      disabled={mutation.isPending}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Enter discount %"
                      value={item.discountPercent}
                      onChange={(e) => handleOrderItemChange(index, 'discountPercent', e.target.value)}
                      min="0"
                      max="100"
                      step="0.01"
                      disabled={mutation.isPending}
                    />
                  </div>
                </div>

                {item.productId && item.quantity && item.unitPrice && (
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '8px 12px', 
                    backgroundColor: '#dbeafe', 
                    borderRadius: '6px',
                    textAlign: 'right'
                  }}>
                    <strong>Subtotal: ₹{calculateItemSubtotal(item)}</strong>
                  </div>
                )}
              </div>
            ))}

            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              backgroundColor: '#f0fdf4', 
              borderRadius: '8px',
              textAlign: 'right'
            }}>
              <h3 style={{ margin: 0, color: '#166534', fontSize: '20px' }}>
                Order Total: ₹{calculateTotal()}
              </h3>
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
                  <span>Creating Order...</span>
                </span>
              ) : (
                'Create Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;

