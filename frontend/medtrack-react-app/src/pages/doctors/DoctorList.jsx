import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDoctors, searchDoctorsByName, deleteDoctor } from '../../api/doctorApi';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './DoctorList.css';

const DoctorList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  // Fetch doctors
  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors', searchQuery],
    queryFn: () => searchQuery ? searchDoctorsByName(searchQuery) : getAllDoctors(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(['doctors']);
      setDeleteModalOpen(false);
      setDoctorToDelete(null);
    },
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRowClick = (doctor) => {
    navigate(`/doctors/${doctor.id}`);
  };

  const handleAddDoctor = () => {
    navigate('/doctors/new');
  };

  const handleEdit = (e, doctor) => {
    e.stopPropagation();
    navigate(`/doctors/${doctor.id}/edit`);
  };

  const handleDeleteClick = (e, doctor) => {
    e.stopPropagation();
    setDoctorToDelete(doctor);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (doctorToDelete) {
      deleteMutation.mutate(doctorToDelete.id);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', width: '25%' },
    { key: 'specialty', label: 'Specialty', width: '20%' },
    { key: 'hospital', label: 'Hospital', width: '25%' },
    { key: 'phone', label: 'Phone', width: '20%' },
    {
      key: 'actions',
      label: 'Actions',
      width: '10%',
      render: (_, doctor) => (
        <div className="action-buttons">
          {isAdmin && (
            <>
              <button
                className="btn-action btn-edit"
                onClick={(e) => handleEdit(e, doctor)}
              >
                Edit
              </button>
              <button
                className="btn-action btn-delete"
                onClick={(e) => handleDeleteClick(e, doctor)}
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
          <h1 className="page-title">Doctors</h1>
          <p className="page-description">Manage your doctor directory</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={handleAddDoctor}>
            + Add Doctor
          </button>
        )}
      </div>

      {error && (
        <ErrorMessage message={error?.response?.data?.message || 'Failed to load doctors'} />
      )}

      <div className="page-content">
        <div className="search-section">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search doctors by name..."
            initialValue={searchQuery}
          />
        </div>

        <Table
          columns={columns}
          data={doctors}
          onRowClick={handleRowClick}
          emptyMessage={searchQuery ? 'No doctors found matching your search' : 'No doctors added yet'}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Doctor"
        size="small"
      >
        <div className="delete-modal">
          <p>Are you sure you want to delete Dr. {doctorToDelete?.name}?</p>
          <p className="delete-warning">This action cannot be undone.</p>
          
          {deleteMutation.isError && (
            <ErrorMessage 
              message={deleteMutation.error?.response?.data?.message || 'Failed to delete doctor'}
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

export default DoctorList;

