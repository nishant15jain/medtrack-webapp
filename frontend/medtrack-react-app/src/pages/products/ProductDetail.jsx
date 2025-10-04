import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../../api/productApi';
import { getSamplesByProductId } from '../../api/sampleApi';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Table from '../../components/common/Table';
import '../doctors/DoctorDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });

  const { data: samples = [], isLoading: samplesLoading } = useQuery({
    queryKey: ['samples', 'product', id],
    queryFn: () => getSamplesByProductId(id),
    enabled: !!id,
  });

  const handleBack = () => {
    navigate('/products');
  };

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate total samples distributed
  const totalSamplesDistributed = samples.reduce((sum, sample) => sum + (sample.quantity || 0), 0);
  const totalDistributions = samples.length;

  // Calculate top doctors
  const doctorStats = samples.reduce((acc, sample) => {
    const doctorId = sample.doctorId;
    const doctorName = sample.doctorName || 'Unknown';
    
    if (!acc[doctorId]) {
      acc[doctorId] = {
        doctorId,
        doctorName,
        totalQuantity: 0,
        distributionCount: 0
      };
    }
    acc[doctorId].totalQuantity += sample.quantity || 0;
    acc[doctorId].distributionCount += 1;
    return acc;
  }, {});

  const topDoctors = Object.values(doctorStats)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 10);

  // Calculate distribution trends by month
  const distributionByMonth = samples.reduce((acc, sample) => {
    const date = new Date(sample.dateIssued);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthLabel,
        quantity: 0,
        count: 0,
        sortKey: monthKey
      };
    }
    acc[monthKey].quantity += sample.quantity || 0;
    acc[monthKey].count += 1;
    return acc;
  }, {});

  const trendData = Object.values(distributionByMonth)
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
    .slice(0, 6);

  const handleDoctorClick = (doctor) => {
    navigate(`/doctors/${doctor.doctorId}`);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="doctor-detail">
        <ErrorMessage message={error?.response?.data?.message || 'Failed to load product details'} />
        <button className="btn-secondary" onClick={handleBack}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="doctor-detail">
      <div className="page-header">
        <div>
          <h1 className="page-title">{product.name}</h1>
          <p className="page-description">{product.category}</p>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <button className="btn-primary" onClick={handleEdit}>
              Edit Product
            </button>
          )}
          <button className="btn-secondary" onClick={handleBack}>
            Back to List
          </button>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-card">
          <h2 className="card-title">Product Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label className="detail-label">Product Name</label>
              <p className="detail-value">{product.name}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Category</label>
              <p className="detail-value">{product.category}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Manufacturer</label>
              <p className="detail-value">{product.manufacturer}</p>
            </div>
            <div className="detail-item detail-item-full">
              <label className="detail-label">Description</label>
              <p className="detail-value">{product.description}</p>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h2 className="card-title">Sample Distribution Statistics</h2>
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
                  <span className="stat-label">Distributions:</span>
                  <span className="stat-value">{totalDistributions}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Doctors:</span>
                  <span className="stat-value">{topDoctors.length}</span>
                </div>
              </div>

              <h3 className="subsection-title">Top Doctors</h3>
              <Table
                columns={[
                  { 
                    key: 'doctorName', 
                    label: 'Doctor Name', 
                    width: '50%'
                  },
                  { 
                    key: 'totalQuantity', 
                    label: 'Total Samples', 
                    width: '25%'
                  },
                  { 
                    key: 'distributionCount', 
                    label: 'Distributions', 
                    width: '25%'
                  },
                ]}
                data={topDoctors}
                onRowClick={handleDoctorClick}
                emptyMessage="No doctors found"
              />

              <h3 className="subsection-title">Distribution Trends (Last 6 Months)</h3>
              <Table
                columns={[
                  { 
                    key: 'month', 
                    label: 'Month', 
                    width: '40%'
                  },
                  { 
                    key: 'quantity', 
                    label: 'Total Quantity', 
                    width: '30%'
                  },
                  { 
                    key: 'count', 
                    label: 'Distributions', 
                    width: '30%'
                  },
                ]}
                data={trendData}
                emptyMessage="No distribution data"
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
                    key: 'doctorName', 
                    label: 'Doctor', 
                    width: '35%',
                    render: (doctorName) => doctorName || 'N/A'
                  },
                  { 
                    key: 'quantity', 
                    label: 'Quantity', 
                    width: '20%'
                  },
                  { 
                    key: 'visit', 
                    label: 'Via Visit', 
                    width: '25%',
                    render: (visit) => visit ? `Visit #${visit.id}` : 'Direct'
                  },
                ]}
                data={samples.slice(0, 10)}
                emptyMessage="No samples distributed"
              />
            </>
          ) : (
            <div className="empty-state">
              <p>📊 No samples distributed yet</p>
              <p className="empty-state-subtitle">
                Sample distribution statistics will appear here once this product is distributed to doctors
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

