import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../../api/userApi';
import { USER_ROLES, ROLE_DESCRIPTIONS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './UserDetail.css';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="doctor-detail">
        <ErrorMessage message={error?.response?.data?.message || 'Failed to load user details'} />
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="doctor-detail">
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/users')}>
          ← Back to Users
        </button>
        <div className="detail-header-content">
          <div>
            <h1 className="detail-title">{user?.name}</h1>
            <div className="detail-badges">
              <span className={`role-badge role-badge-${user?.role?.toLowerCase()}`}>
                {user?.role}
              </span>
              <span className={`status-badge ${user?.isActive ? 'status-active' : 'status-inactive'}`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="btn-edit" 
              onClick={() => navigate(`/users/${id}/edit`)}
            >
              Edit User
            </button>
          </div>
        </div>
      </div>

      <div className="detail-content">
        {/* Basic Information */}
        <div className="detail-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Full Name </span>
              <span className="info-value">{user?.name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email </span>
              <span className="info-value">{user?.email || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone </span>
              <span className="info-value">{user?.phone || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role </span>
              <span className="info-value">
                <span className={`role-badge role-badge-${user?.role?.toLowerCase()}`}>
                  {user?.role}
                </span>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Role Description</span>
              <span className="info-value">{ROLE_DESCRIPTIONS[user?.role] || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Account Status</span>
              <span className="info-value">
                <span className={`status-badge ${user?.isActive ? 'status-active' : 'status-inactive'}`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Account Created</span>
              <span className="info-value">{formatDate(user?.createdAt)}</span>
            </div>
            {user?.updatedAt && (
              <div className="info-item">
                <span className="info-label">Last Updated</span>
                <span className="info-value">{formatDate(user?.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Locations */}
        <div className="detail-section">
          <h2 className="section-title">Assigned Locations</h2>
          {user?.locations && user.locations.length > 0 ? (
            <div className="locations-grid">
              {user.locations.map((location) => (
                <div key={location.id} className="location-card">
                  <div className="location-card-header">
                    <h3 className="location-name">📍 {location.name}</h3>
                    <span className={`status-badge ${location.isActive ? 'status-active' : 'status-inactive'}`}>
                      {location.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="location-card-body">
                    <p className="location-detail">
                      <strong>City:</strong> {location.city}
                    </p>
                    {location.state && (
                      <p className="location-detail">
                        <strong>State:</strong> {location.state}
                      </p>
                    )}
                    <p className="location-detail">
                      <strong>Country:</strong> {location.country || 'N/A'}
                    </p>
                    {location.address && (
                      <p className="location-detail">
                        <strong>Address:</strong> {location.address}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-message">
                {user?.role === USER_ROLES.REP 
                  ? 'No locations assigned to this user yet.'
                  : 'This user role does not require location assignments.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

