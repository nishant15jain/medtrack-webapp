import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllUsers, 
  getUsersByRole, 
  deleteUser, 
  activateUser, 
  deactivateUser 
} from '../../api/userApi';
import { USER_ROLES } from '../../utils/constants';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorList.css';
import './UserList.css';

const UserList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users', selectedRole],
    queryFn: () => 
      selectedRole === 'ALL' ? getAllUsers() : getUsersByRole(selectedRole),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => 
      isActive ? deactivateUser(id) : activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
  };

  const handleAddUser = () => {
    navigate('/users/new');
  };

  const handleDeleteClick = (e, user) => {
    e.stopPropagation();
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  const handleToggleActive = (e, user) => {
    e.stopPropagation();
    toggleActiveMutation.mutate({ id: user.id, isActive: user.isActive });
  };

  const handleRowClick = (user) => {
    navigate(`/users/${user.id}`);
  };

  const columns = [
    { key: 'name', label: 'Name', width: '20%' },
    { key: 'email', label: 'Email', width: '25%' },
    { 
      key: 'role', 
      label: 'Role', 
      width: '15%',
      render: (role) => (
        <span className={`role-badge role-badge-${role.toLowerCase()}`}>
          {role}
        </span>
      )
    },
    { key: 'phone', label: 'Phone', width: '15%' },
    {
      key: 'isActive',
      label: 'Status',
      width: '10%',
      render: (isActive) => (
        <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '15%',
      render: (_, user) => (
        <div className="action-buttons">
          <button
            className={`btn-action ${user.isActive ? 'btn-deactivate' : 'btn-activate'}`}
            onClick={(e) => handleToggleActive(e, user)}
            disabled={toggleActiveMutation.isPending}
          >
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            className="btn-action btn-delete"
            onClick={(e) => handleDeleteClick(e, user)}
          >
            Delete
          </button>
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
          <h1 className="page-title">Users</h1>
          <p className="page-description">Manage system users and their roles</p>
        </div>
        <button className="btn-primary" onClick={handleAddUser}>
          + Add User
        </button>
      </div>

      {error && (
        <ErrorMessage message={error?.response?.data?.message || 'Failed to load users'} />
      )}

      <div className="page-content">
        <div className="filter-section">
          <label className="filter-label">Filter by Role:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedRole === 'ALL' ? 'filter-btn-active' : ''}`}
              onClick={() => handleRoleFilter('ALL')}
            >
              All
            </button>
            {Object.values(USER_ROLES).map((role) => (
              <button
                key={role}
                className={`filter-btn ${selectedRole === role ? 'filter-btn-active' : ''}`}
                onClick={() => handleRoleFilter(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <Table
          columns={columns}
          data={users}
          onRowClick={handleRowClick}
          emptyMessage="No users found"
        />
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User"
        size="small"
      >
        <div className="delete-modal">
          <p>Are you sure you want to delete {userToDelete?.name}?</p>
          <p className="delete-warning">This action cannot be undone.</p>
          
          {deleteMutation.isError && (
            <ErrorMessage 
              message={deleteMutation.error?.response?.data?.message || 'Failed to delete user'}
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

export default UserList;

