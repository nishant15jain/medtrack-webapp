import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderById, updateOrderStatus, deleteOrder } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import '../doctors/DoctorDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [editData, setEditData] = useState({
    status: '',
    paymentStatus: '',
    notes: ''
  });

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isManager = user?.role === USER_ROLES.MANAGER;
  const canEdit = isAdmin || isManager || user?.role === USER_ROLES.REP;
  const canDelete = isAdmin || isManager;

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    onSuccess: (data) => {
      setEditData({
        status: data.status,
        paymentStatus: data.paymentStatus,
        notes: data.notes || ''
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', id]);
      queryClient.invalidateQueries(['orders']);
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      navigate('/orders');
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      status: order.status,
      paymentStatus: order.paymentStatus,
      notes: order.notes || ''
    });
    updateMutation.reset();
  };

  const handleSaveEdit = () => {
    updateMutation.mutate(editData);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      PENDING: 'status-pending',
      CONFIRMED: 'status-confirmed',
      SHIPPED: 'status-shipped',
      DELIVERED: 'status-delivered',
      CANCELLED: 'status-cancelled'
    };
    return statusClasses[status] || '';
  };

  const getPaymentBadgeClass = (paymentStatus) => {
    const paymentClasses = {
      UNPAID: 'payment-unpaid',
      PARTIAL: 'payment-partial',
      PAID: 'payment-paid'
    };
    return paymentClasses[paymentStatus] || '';
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="doctor-detail">
        <ErrorMessage message={error?.response?.data?.message || 'Failed to load order'} />
      </div>
    );
  }

  return (
    <div className="doctor-detail">
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Details</h1>
          <p className="page-description">View and manage order information</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate('/orders')}>
            Back to Orders
          </button>
          {!isEditing && canEdit && (
            <button className="btn-primary" onClick={handleEditClick}>
              Edit Status
            </button>
          )}
          {canDelete && (
            <button className="btn-danger" onClick={handleDeleteClick}>
              Delete Order
            </button>
          )}
        </div>
      </div>

      {updateMutation.isError && (
        <ErrorMessage 
          message={updateMutation.error?.response?.data?.message || 'Failed to update order'}
          onClose={() => updateMutation.reset()}
        />
      )}

      <div className="detail-content">
        {/* Order Information Card */}
        <div className="detail-card">
          <div className="card-header">
            <h2>Order Information</h2>
            <span className="order-number" style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: '#3b82f6' 
            }}>
              {order.orderNumber}
            </span>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Order Date:</span>
              <span className="detail-value">{formatDate(order.orderDate)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value" style={{ 
                fontWeight: '700', 
                fontSize: '18px', 
                color: '#059669' 
              }}>
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              {isEditing ? (
                <select
                  name="status"
                  className="form-input"
                  value={editData.status}
                  onChange={handleChange}
                  style={{ maxWidth: '200px' }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              ) : (
                <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              )}
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment Status:</span>
              {isEditing ? (
                <select
                  name="paymentStatus"
                  className="form-input"
                  value={editData.paymentStatus}
                  onChange={handleChange}
                  style={{ maxWidth: '200px' }}
                >
                  <option value="UNPAID">Unpaid</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="PAID">Paid</option>
                </select>
              ) : (
                <span className={`payment-badge ${getPaymentBadgeClass(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              )}
            </div>
            {order.visitId && (
              <div className="detail-item">
                <span className="detail-label">Associated Visit:</span>
                <span 
                  className="detail-value" 
                  style={{ color: '#3b82f6', cursor: 'pointer' }}
                  onClick={() => navigate(`/visits/${order.visitId}`)}
                >
                  Visit on {formatDate(order.visitDate)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Doctor Information Card */}
        <div className="detail-card">
          <div className="card-header">
            <h2>Doctor Information</h2>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span 
                className="detail-value" 
                style={{ color: '#3b82f6', cursor: 'pointer' }}
                onClick={() => navigate(`/doctors/${order.doctorId}`)}
              >
                {order.doctorName}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Specialty:</span>
              <span className="detail-value">{order.doctorSpecialty}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Hospital:</span>
              <span className="detail-value">{order.doctorHospital}</span>
            </div>
          </div>
        </div>

        {/* Order Items Card */}
        <div className="detail-card">
          <div className="card-header">
            <h2>Order Items</h2>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              {order.orderItems?.length || 0} items
            </span>
          </div>
          <div className="order-items-table" style={{ 
            overflowX: 'auto',
            width: '100%',
            maxWidth: '100%'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '600px'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#f9fafb', 
                  borderBottom: '2px solid #e5e7eb' 
                }}>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>Product</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>Quantity</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>Unit Price</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>Discount</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems?.map((item, index) => (
                  <tr key={item.id || index} style={{ 
                    borderBottom: '1px solid #e5e7eb' 
                  }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#111827' }}>
                          {item.productName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {item.productCategory}
                        </div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      {item.quantity}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'right' 
                    }}>
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'right',
                      color: item.discountPercent > 0 ? '#dc2626' : '#6b7280'
                    }}>
                      {item.discountPercent > 0 ? `${item.discountPercent}%` : '-'}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#059669'
                    }}>
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ 
                  backgroundColor: '#f0fdf4', 
                  borderTop: '2px solid #10b981' 
                }}>
                  <td colSpan="4" style={{ 
                    padding: '16px', 
                    textAlign: 'right',
                    fontWeight: '700',
                    fontSize: '16px',
                    color: '#065f46'
                  }}>
                    Total:
                  </td>
                  <td style={{ 
                    padding: '16px', 
                    textAlign: 'right',
                    fontWeight: '700',
                    fontSize: '18px',
                    color: '#059669'
                  }}>
                    {formatCurrency(order.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Notes Card */}
        <div className="detail-card">
          <div className="card-header">
            <h2>Notes</h2>
          </div>
          <div className="detail-grid">
            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              {isEditing ? (
                <textarea
                  name="notes"
                  className="form-input"
                  value={editData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Add notes about this order..."
                  style={{ width: '100%' }}
                />
              ) : (
                <span className="detail-value">
                  {order.notes || 'No notes added'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="detail-card">
          <div className="card-header">
            <h2>Timestamps</h2>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            {order.updatedAt && (
              <div className="detail-item">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">
                  {new Date(order.updatedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="form-actions" style={{ 
            marginTop: '24px', 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end' 
          }}>
            <button
              className="btn-secondary"
              onClick={handleCancelEdit}
              disabled={updateMutation.isPending}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <span className="btn-loading">
                  <LoadingSpinner size="small" />
                  <span>Saving...</span>
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Order"
        size="small"
      >
        <div className="delete-modal">
          <p>Are you sure you want to delete order <strong>{order.orderNumber}</strong>?</p>
          <p className="delete-warning">This action cannot be undone and will delete all order items.</p>
          
          {deleteMutation.isError && (
            <ErrorMessage 
              message={deleteMutation.error?.response?.data?.message || 'Failed to delete order'}
            />
          )}

          <div className="modal-actions">
            <button
              className="btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>

      <style jsx="true">{`
        .status-badge, .payment-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          display: inline-block;
        }

        .status-pending {
          background-color: #fef3c7;
          color: #92400e;
        }

        .status-confirmed {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .status-shipped {
          background-color: #e0e7ff;
          color: #4338ca;
        }

        .status-delivered {
          background-color: #d1fae5;
          color: #065f46;
        }

        .status-cancelled {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .payment-unpaid {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .payment-partial {
          background-color: #fef3c7;
          color: #92400e;
        }

        .payment-paid {
          background-color: #d1fae5;
          color: #065f46;
        }

        /* Mobile responsive styles for order items table */
        @media (max-width: 768px) {
          .order-items-table {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .order-items-table table {
            font-size: 14px;
          }
          
          .order-items-table th,
          .order-items-table td {
            padding: 8px !important;
            white-space: nowrap;
          }
          
          .order-items-table th:first-child,
          .order-items-table td:first-child {
            position: sticky;
            left: 0;
            background-color: inherit;
            z-index: 1;
          }
          
          .order-items-table thead th:first-child {
            background-color: #f9fafb;
          }
          
          .order-items-table tbody tr:nth-child(even) td:first-child {
            background-color: #ffffff;
          }
          
          .order-items-table tbody tr:nth-child(odd) td:first-child {
            background-color: #f9fafb;
          }
          
          .order-items-table tfoot td:first-child {
            background-color: #f0fdf4;
          }
        }

        @media (max-width: 480px) {
          .order-items-table table {
            font-size: 12px;
          }
          
          .order-items-table th,
          .order-items-table td {
            padding: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetail;

