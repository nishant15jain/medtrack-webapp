import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllVisits, getVisitsByDateRange, deleteVisit } from '../../api/visitApi';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
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

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  // const isManager = user?.role === USER_ROLES.MANAGER;
  // const canDelete = isAdmin || isManager;

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

  const columns = [
    { 
      key: 'visitDate', 
      label: 'Visit Date', 
      width: '15%',
      render: (date) => formatDate(date)
    },
    { 
      key: 'doctorName', 
      label: 'Doctor', 
      width: '20%',
      render: (doctorName) => doctorName || 'N/A'
    },
    { 
      key: 'userName', 
      label: 'Sales Rep', 
      width: '20%',
      render: (userName) => userName || 'N/A'
    },
    { 
      key: 'notes', 
      label: 'Notes', 
      width: '35%',
      render: (notes) => (
        <span className="text-truncate">{notes || 'No notes'}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '10%',
      render: (_, visit) => (
        <div className="action-buttons">
          {isAdmin && (
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
        <button className="btn-primary" onClick={handleAddVisit}>
          + Log Visit
        </button>
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
    </div>
  );
};

export default VisitList;

