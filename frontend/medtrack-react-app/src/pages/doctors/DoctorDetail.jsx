import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDoctorById } from '../../api/doctorApi';
import { getVisitsByDoctorId } from '../../api/visitApi';
import { getSamplesByDoctorId } from '../../api/sampleApi';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Table from '../../components/common/Table';
import './DoctorDetail.css';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const { data: doctor, isLoading, error } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => getDoctorById(id),
  });

  const { data: visits = [], isLoading: visitsLoading } = useQuery({
    queryKey: ['visits', 'doctor', id],
    queryFn: () => getVisitsByDoctorId(id),
    enabled: !!id,
  });

  const { data: samples = [], isLoading: samplesLoading } = useQuery({
    queryKey: ['samples', 'doctor', id],
    queryFn: () => getSamplesByDoctorId(id),
    enabled: !!id,
  });

  const handleBack = () => {
    navigate('/doctors');
  };

  const handleEdit = () => {
    navigate(`/doctors/${id}/edit`);
  };

  const handleVisitClick = (visit) => {
    navigate(`/visits/${visit.id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate sample statistics
  const sampleStats = samples.reduce((acc, sample) => {
    const productName = sample.productName || 'Unknown';
    if (!acc[productName]) {
      acc[productName] = {
        productName,
        quantity: 0,
        count: 0
      };
    }
    acc[productName].quantity += sample.quantity || 0;
    acc[productName].count += 1;
    return acc;
  }, {});

  const sampleStatsArray = Object.values(sampleStats);
  const totalSamplesDistributed = samples.reduce((sum, sample) => sum + (sample.quantity || 0), 0);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="doctor-detail">
        <ErrorMessage message={error?.response?.data?.message || 'Failed to load doctor details'} />
        <button className="btn-secondary" onClick={handleBack}>
          Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="doctor-detail">
      <div className="page-header">
        <div>
          <h1 className="page-title">{doctor.name}</h1>
          <p className="page-description">{doctor.specialty}</p>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <button className="btn-primary" onClick={handleEdit}>
              Edit Doctor
            </button>
          )}
          <button className="btn-secondary" onClick={handleBack}>
            Back to List
          </button>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-card">
          <h2 className="card-title">Basic Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label className="detail-label">Full Name</label>
              <p className="detail-value">{doctor.name}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Specialty</label>
              <p className="detail-value">{doctor.specialty}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Hospital</label>
              <p className="detail-value">{doctor.hospital}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Phone</label>
              <p className="detail-value">
                <a href={`tel:${doctor.phone}`} className="phone-link">
                  {doctor.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h2 className="card-title">Visit History</h2>
          {visitsLoading ? (
            <LoadingSpinner />
          ) : visits.length > 0 ? (
            <>
              <div className="stats-summary">
                <div className="stat-item">
                  <span className="stat-label">Total Visits:</span>
                  <span className="stat-value">{visits.length}</span>
                </div>
              </div>
              <Table
                columns={[
                  { 
                    key: 'visitDate', 
                    label: 'Date', 
                    width: '20%',
                    render: (date) => formatDate(date)
                  },
                  { 
                    key: 'userName', 
                    label: 'Sales Rep', 
                    width: '25%',
                    render: (userName) => userName || 'N/A'
                  },
                  { 
                    key: 'notes', 
                    label: 'Notes', 
                    width: '55%',
                    render: (notes) => notes || 'No notes'
                  },
                ]}
                data={visits}
                onRowClick={handleVisitClick}
                emptyMessage="No visits found"
              />
            </>
          ) : (
            <div className="empty-state">
              <p>📅 No visits recorded yet</p>
              <p className="empty-state-subtitle">
                Visit history will appear here once visits are logged for this doctor
              </p>
            </div>
          )}
        </div>

        <div className="detail-card">
          <h2 className="card-title">Samples Distributed</h2>
          {samplesLoading ? (
            <LoadingSpinner />
          ) : samples.length > 0 ? (
            <>
              <div className="stats-summary">
                <div className="stat-item">
                  <span className="stat-label">Total Samples:</span>
                  <span className="stat-value">{totalSamplesDistributed}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Products:</span>
                  <span className="stat-value">{sampleStatsArray.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Distributions:</span>
                  <span className="stat-value">{samples.length}</span>
                </div>
              </div>

              <h3 className="subsection-title">By Product</h3>
              <Table
                columns={[
                  { 
                    key: 'productName', 
                    label: 'Product', 
                    width: '50%'
                  },
                  { 
                    key: 'quantity', 
                    label: 'Total Quantity', 
                    width: '25%'
                  },
                  { 
                    key: 'count', 
                    label: 'Times Issued', 
                    width: '25%'
                  },
                ]}
                data={sampleStatsArray}
                emptyMessage="No samples distributed"
              />

              <h3 className="subsection-title">Recent Distributions</h3>
              <Table
                columns={[
                  { 
                    key: 'dateIssued', 
                    label: 'Date', 
                    width: '20%',
                    render: (date) => formatDate(date)
                  },
                  { 
                    key: 'productName', 
                    label: 'Product', 
                    width: '40%',
                    render: (productName) => productName || 'N/A'
                  },
                  { 
                    key: 'quantity', 
                    label: 'Quantity', 
                    width: '20%'
                  },
                  { 
                    key: 'visit', 
                    label: 'Via Visit', 
                    width: '20%',
                    render: (visit) => visit ? `Visit #${visit.id}` : 'Direct'
                  },
                ]}
                data={samples.slice(0, 10)}
                emptyMessage="No samples distributed"
              />
            </>
          ) : (
            <div className="empty-state">
              <p>📦 No samples distributed yet</p>
              <p className="empty-state-subtitle">
                Sample distribution history will appear here once samples are issued to this doctor
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;

