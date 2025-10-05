import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAllLocations, deleteLocation, activateLocation, deactivateLocation } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import './LocationList.css';

const LocationList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['locations', showActiveOnly],
    queryFn: () => getAllLocations(showActiveOnly),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries(['locations']);
      setDeleteModalOpen(false);
      setLocationToDelete(null);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => 
      isActive ? deactivateLocation(id) : activateLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['locations']);
    },
  });

  const handleDelete = (location) => {
    setLocationToDelete(location);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      deleteMutation.mutate(locationToDelete.id);
    }
  };

  const handleToggleActive = (location) => {
    toggleActiveMutation.mutate({ id: location.id, isActive: location.isActive });
  };

  const filteredLocations = locations?.filter((location) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      location.name.toLowerCase().includes(searchLower) ||
      location.city.toLowerCase().includes(searchLower) ||
      (location.state && location.state.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    { key: 'name', label: 'Location Name' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'country', label: 'Country' },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (isActive, location) => (
        <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, location) => (
        <div className="action-buttons">
          <button
            className="btn-icon btn-edit"
            onClick={() => navigate(`/locations/edit/${location.id}`)}
            title="Edit Location"
          >
            <i className="icon-edit">✏️</i>
          </button>
          <button
            className="btn-icon btn-toggle"
            onClick={() => handleToggleActive(location)}
            title={location.isActive ? 'Deactivate' : 'Activate'}
          >
            <i className="icon-toggle">{location.isActive ? '🔴' : '🟢'}</i>
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={() => handleDelete(location)}
            title="Delete Location"
          >
            <i className="icon-delete">🗑️</i>
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="location-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Locations</h1>
          <p className="page-description">Manage locations and assign them to users</p>
        </div>
        <div className="page-actions">
          <button className="btn-primary" onClick={() => navigate('/locations/bulk')}>
            + Add Locations
          </button>
          {/* <button className="btn-primary" onClick={() => navigate('/locations/new')}>
            + Add Location
          </button> */}
        </div>
      </div>

      <div className="filters-section">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, city, or state..."
        />
        <div className="filter-toggle">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
            />
            Show Active Only
          </label>
        </div>
      </div>

      <div className="locations-count">
        Total Locations: <strong>{filteredLocations?.length || 0}</strong>
      </div>

      <Table 
        columns={columns} 
        data={filteredLocations || []}
        emptyMessage="No locations found. Add your first location to get started."
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Location"
      >
        <div className="modal-content">
          <p>Are you sure you want to delete <strong>{locationToDelete?.name}</strong>?</p>
          <p className="warning-text">This action cannot be undone and may affect users assigned to this location.</p>
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
              onClick={confirmDelete}
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

export default LocationList;

