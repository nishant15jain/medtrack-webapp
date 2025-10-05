import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllVisits, getVisitsByDateRange, deleteVisit, endVisit } from '../../api/visitApi';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES, VISIT_STATUS } from '../../utils/constants';
import Table from '../../components/common/Table';
import DateRangePicker from '../../components/common/DateRangePicker';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorList.css';
import './VisitList.css';

const VisitList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState(null);
  const [endVisitModalOpen, setEndVisitModalOpen] = useState(false);
  const [visitToEnd, setVisitToEnd] = useState(null);
  const [endNotes, setEndNotes] = useState('');

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isManager = user?.role === USER_ROLES.MANAGER;
  const isRep = user?.role === USER_ROLES.REP;
  const canManuallyLogVisit = isAdmin || isManager;


  const { data: visits, isLoading, error } = useQuery({
    queryKey: ['visits', dateRange],
    queryFn: () => 
      dateRange 
        ? getVisitsByDateRange(dateRange.startDate, dateRange.endDate)
        : getAllVisits(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVisit,
    onSuccess: () => {
      queryClient.invalidateQueries(['visits']);
      setDeleteModalOpen(false);
      setVisitToDelete(null);
    },
  });

  const endVisitMutation = useMutation({
    mutationFn: ({ id, notes }) => endVisit(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(['visits']);
      queryClient.invalidateQueries(['activeVisits']);
      setEndVisitModalOpen(false);
      setVisitToEnd(null);
      setEndNotes('');
    },
  });

  const handleDateRangeApply = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  const handleDateRangeClear = () => {
    setDateRange(null);
  };

  const handleRowClick = (visit) => {
    navigate(`/visits/${visit.id}`);
  };

  const handleAddVisit = () => {
    navigate('/visits/new');
  };

  const handleStartVisit = () => {
    navigate('/visits/start');
  };

  const handleEndVisit = (e, visit) => {
    e.stopPropagation();
    setVisitToEnd(visit);
    setEndNotes('');
    setEndVisitModalOpen(true);
  };

  const confirmEndVisit = () => {
    if (visitToEnd) {
      endVisitMutation.mutate({ id: visitToEnd.id, notes: endNotes });
    }
  };

  const handleEdit = (e, visit) => {
    e.stopPropagation();
    navigate(`/visits/${visit.id}/edit`);
  };

  const handleDeleteClick = (e, visit) => {
    e.stopPropagation();
    setVisitToDelete(visit);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (visitToDelete) {
      deleteMutation.mutate(visitToDelete.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'IN_PROGRESS': { label: 'In Progress', class: 'status-in-progress' },
      'COMPLETED': { label: 'Completed', class: 'status-completed' },
      'CANCELLED': { label: 'Cancelled', class: 'status-cancelled' }
    };
    const config = statusConfig[status] || statusConfig['COMPLETED'];
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const columns = [
    { 
      key: 'visitDate', 
      label: 'Visit Date', 
      width: '10%',
      render: (_, visit) => formatDate(visit.visitDate)
    },
    { 
      key: 'status', 
      label: 'Status', 
      width: '10%',
      render: (_, visit) => getStatusBadge(visit.status || 'COMPLETED')
    },
    { 
      key: 'locationName', 
      label: 'Location', 
      width: '12%',
      render: (locationName) => locationName || 'N/A'
    },
    { 
      key: 'doctorName', 
      label: 'Doctor', 
      width: '15%',
      render: (doctorName) => doctorName || 'N/A'
    },
    { 
      key: 'userName', 
      label: 'Sales Rep', 
      width: '12%',
      render: (userName) => userName || 'N/A'
    },
    { 
      key: 'checkInTime', 
      label: 'Check-In', 
      width: '10%',
      render: (_, visit) => formatDateTime(visit.checkInTime)
    },
    { 
      key: 'checkOutTime', 
      label: 'Check-Out', 
      width: '10%',
      render: (_, visit) => formatDateTime(visit.checkOutTime)
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '11%',
      render: (_, visit) => (
        <div className="action-buttons">
          {visit.status === 'IN_PROGRESS' && (
            <button
              className="btn-action btn-end-visit"
              onClick={(e) => handleEndVisit(e, visit)}
            >
              End Visit
            </button>
          )}
          {isAdmin && visit.status !== 'IN_PROGRESS' && (
            <>
              <button
                className="btn-action btn-edit"
                onClick={(e) => handleEdit(e, visit)}
              >
                Edit
              </button>
              <button
                className="btn-action btn-delete"
                onClick={(e) => handleDeleteClick(e, visit)}
              >
                Delete
              </button>
            </>
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
          <h1 className="page-title">Visits</h1>
          <p className="page-description">Track doctor visits and activities</p>
        </div>
        <div className="header-actions">
          {/* Start Visit - Primary button for REPs (location-based workflow) */}
          {(isRep || isManager || isAdmin) && (
            <button className="btn-success" onClick={handleStartVisit}>
              ▶️ Start Visit
            </button>
          )}
          {/* Log Visit - Manual entry for ADMIN/MANAGER (backdated or corrections) */}
          {canManuallyLogVisit && (
            <button className="btn-primary" onClick={handleAddVisit}>
              📝 Log Visit
            </button>
          )}
        </div>
      </div>

      {error && (
        <ErrorMessage message={error?.response?.data?.message || 'Failed to load visits'} />
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
          data={visits}
          onRowClick={handleRowClick}
          emptyMessage="No visits found"
        />
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Visit"
        size="small"
      >
        <div className="delete-modal">
          <p>Are you sure you want to delete this visit?</p>
          <p className="delete-warning">This action cannot be undone.</p>
          
          {deleteMutation.isError && (
            <ErrorMessage 
              message={deleteMutation.error?.response?.data?.message || 'Failed to delete visit'}
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

      <Modal
        isOpen={endVisitModalOpen}
        onClose={() => setEndVisitModalOpen(false)}
        title="End Visit"
      >
        <div className="end-visit-modal">
          <p>Complete your visit with <strong>{visitToEnd?.doctorName}</strong></p>
          <p className="visit-info">Check-out time will be recorded automatically</p>
          
          <div className="form-group">
            <label htmlFor="endNotes" className="form-label">
              Final Notes (Optional)
            </label>
            <textarea
              id="endNotes"
              className="form-input"
              rows="4"
              placeholder="Add any final notes about this visit..."
              value={endNotes}
              onChange={(e) => setEndNotes(e.target.value)}
              disabled={endVisitMutation.isPending}
            />
          </div>
          
          {endVisitMutation.isError && (
            <ErrorMessage 
              message={endVisitMutation.error?.response?.data?.message || 'Failed to end visit'}
            />
          )}

          <div className="modal-actions">
            <button
              className="btn-secondary"
              onClick={() => setEndVisitModalOpen(false)}
              disabled={endVisitMutation.isPending}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={confirmEndVisit}
              disabled={endVisitMutation.isPending}
            >
              {endVisitMutation.isPending ? 'Ending Visit...' : '✓ Complete Visit'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VisitList;

