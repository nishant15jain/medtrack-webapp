import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOrders, getOrdersByDateRange, deleteOrder } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import Table from '../../components/common/Table';
import DateRangePicker from '../../components/common/DateRangePicker';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorList.css';
import '../visits/VisitList.css';

const OrderList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isManager = user?.role === USER_ROLES.MANAGER;
  const canDelete = isAdmin || isManager;

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', dateRange],
    queryFn: () => 
      dateRange 
        ? getOrdersByDateRange(dateRange.startDate, dateRange.endDate)
        : getAllOrders(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    },
  });

  const handleDateRangeApply = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  const handleDateRangeClear = () => {
    setDateRange(null);
  };

  const handleCreateOrder = () => {
    navigate('/orders/new');
  };

  const handleViewDetails = (order) => {
    navigate(`/orders/${order.id}`);
  };

  const handleDeleteClick = (e, order) => {
    e.stopPropagation();
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      deleteMutation.mutate(orderToDelete.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const columns = [
    { 
      key: 'orderNumber', 
      label: 'Order #', 
      width: '12%',
      render: (orderNumber) => (
        <span style={{ fontWeight: '600', color: '#3b82f6' }}>{orderNumber}</span>
      )
    },
    { 
      key: 'orderDate', 
      label: 'Date', 
      width: '10%',
      render: (date) => formatDate(date)
    },
    { 
      key: 'doctorName', 
      label: 'Doctor', 
      width: '18%',
      render: (doctorName) => doctorName || 'N/A'
    },
    { 
      key: 'totalAmount', 
      label: 'Total', 
      width: '10%',
      render: (amount) => (
        <span style={{ fontWeight: '600' }}>{formatCurrency(amount)}</span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      width: '12%',
      render: (status) => (
        <span className={`status-badge ${getStatusBadgeClass(status)}`}>
          {status}
        </span>
      )
    },
    { 
      key: 'paymentStatus', 
      label: 'Payment', 
      width: '10%',
      render: (paymentStatus) => (
        <span className={`payment-badge ${getPaymentBadgeClass(paymentStatus)}`}>
          {paymentStatus}
        </span>
      )
    },
    { 
      key: 'orderItems', 
      label: 'Items', 
      width: '8%',
      render: (orderItems) => orderItems?.length || 0
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '15%',
      render: (_, order) => (
        <div className="action-buttons">
          <button
            className="btn-action btn-view"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(order);
            }}
          >
            View
          </button>
          {canDelete && (
            <button
              className="btn-action btn-delete"
              onClick={(e) => handleDeleteClick(e, order)}
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="doctor-list">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-description">Manage product orders from doctors</p>
        </div>
        <button className="btn-primary" onClick={handleCreateOrder}>
          + Create Order
        </button>
      </div>

      {error && (
        <ErrorMessage message={error?.response?.data?.message || 'Failed to load orders'} />
      )}

      <div className="page-content">
        <div className="filter-section-visits">
          <DateRangePicker
            onApply={handleDateRangeApply}
            onClear={handleDateRangeClear}
          />
        </div>

        <Table
          columns={columns}
          data={orders}
          emptyMessage="No orders found"
          onRowClick={handleViewDetails}
        />
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Order"
        size="small"
      >
        <div className="delete-modal">
          <p>Are you sure you want to delete order <strong>{orderToDelete?.orderNumber}</strong>?</p>
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
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
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

        .btn-view {
          background-color: #3b82f6;
          color: white;
        }

        .btn-view:hover {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default OrderList;

