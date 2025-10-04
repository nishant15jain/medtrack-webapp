import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllSamples, getSamplesByDateRange, deleteSample } from '../../api/sampleApi';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import Table from '../../components/common/Table';
import DateRangePicker from '../../components/common/DateRangePicker';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorList.css';
import '../visits/VisitList.css';

const SampleList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sampleToDelete, setSampleToDelete] = useState(null);

  const isAdmin = user?.role === USER_ROLES.ADMIN;
    // const isManager = user?.role === USER_ROLES.MANAGER;
    // const canDelete = isAdmin || isManager;

  const { data: samples, isLoading, error } = useQuery({
    queryKey: ['samples', dateRange],
    queryFn: () => 
      dateRange 
        ? getSamplesByDateRange(dateRange.startDate, dateRange.endDate)
        : getAllSamples(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSample,
    onSuccess: () => {
      queryClient.invalidateQueries(['samples']);
      setDeleteModalOpen(false);
      setSampleToDelete(null);
    },
  });

  const handleDateRangeApply = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  const handleDateRangeClear = () => {
    setDateRange(null);
  };

  const handleIssueSample = () => {
    navigate('/samples/new');
  };

  const handleEdit = (e, sample) => {
    e.stopPropagation();
    navigate(`/samples/${sample.id}/edit`);
  };

  const handleDeleteClick = (e, sample) => {
    e.stopPropagation();
    setSampleToDelete(sample);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (sampleToDelete) {
      deleteMutation.mutate(sampleToDelete.id);
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
      key: 'dateIssued', 
      label: 'Date', 
      width: '12%',
      render: (date) => formatDate(date)
    },
    { 
      key: 'productName', 
      label: 'Product', 
      width: '20%',
      render: (productName) => productName || 'N/A'
    },
    { 
      key: 'doctorName', 
      label: 'Doctor', 
      width: '18%',
      render: (doctorName) => doctorName || 'N/A'
    },
    { 
      key: 'quantity', 
      label: 'Quantity', 
      width: '10%'
    },
    // { 
    //   key: 'productCategory', 
    //   label: 'Category', 
    //   width: '15%',
    //   render: (productCategory) => productCategory || 'N/A'
    // },
    { 
      key: 'visit', 
      label: 'Visit', 
      width: '12%',
      render: (visit) => visit ? `Visit #${visit.id}` : 'Direct'
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '13%',
      render: (_, sample) => (
        <div className="action-buttons">
          {isAdmin && (
            <>
          <button
            className="btn-action btn-edit"
            onClick={(e) => handleEdit(e, sample)}
          >
            Edit
          </button>
            <button
              className="btn-action btn-delete"
              onClick={(e) => handleDeleteClick(e, sample)}
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
          <h1 className="page-title">Samples</h1>
          <p className="page-description">Track product sample distribution</p>
        </div>
        <button className="btn-primary" onClick={handleIssueSample}>
          + Issue Sample
        </button>
      </div>

      {error && (
        <ErrorMessage message={error?.response?.data?.message || 'Failed to load samples'} />
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
          data={samples}
          emptyMessage="No samples issued yet"
        />
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Sample"
        size="small"
      >
        <div className="delete-modal">
          <p>Are you sure you want to delete this sample record?</p>
          <p className="delete-warning">This action cannot be undone.</p>
          
          {deleteMutation.isError && (
            <ErrorMessage 
              message={deleteMutation.error?.response?.data?.message || 'Failed to delete sample'}
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

export default SampleList;

