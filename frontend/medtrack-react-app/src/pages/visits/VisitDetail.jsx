import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVisitById } from '../../api/visitApi';
import { getSamplesByVisitId } from '../../api/sampleApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Table from '../../components/common/Table';
import '../doctors/DoctorDetail.css';

const VisitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: visit, isLoading: isVisitLoading, error: visitError } = useQuery({
    queryKey: ['visit', id],
    queryFn: () => getVisitById(id),
  });

  const { data: samples, isLoading: isSamplesLoading } = useQuery({
    queryKey: ['samples', 'visit', id],
    queryFn: () => getSamplesByVisitId(id),
    enabled: !!id,
  });

  const handleBack = () => {
    navigate('/visits');
  };

  const handleEdit = () => {
    navigate(`/visits/${id}/edit`);
  };

  const handleIssueSample = () => {
    navigate(`/samples/new?visitId=${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sampleColumns = [
    { 
      key: 'product', 
      label: 'Product', 
      width: '30%',
      render: (product) => product?.name || 'N/A'
    },
    { 
      key: 'quantity', 
      label: 'Quantity', 
      width: '20%'
    },
    { 
      key: 'dateIssued', 
      label: 'Date Issued', 
      width: '25%',
      render: (date) => formatDate(date)
    },
    { 
      key: 'product', 
      label: 'Category', 
      width: '25%',
      render: (product) => product?.category || 'N/A'
    },
  ];

  if (isVisitLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (visitError) {
    return (
      <div className="doctor-detail">
        <ErrorMessage message={visitError?.response?.data?.message || 'Failed to load visit details'} />
        <button className="btn-secondary" onClick={handleBack}>
          Back to Visits
        </button>
      </div>
    );
  }

  return (
    <div className="doctor-detail">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visit Details</h1>
          <p className="page-description">{formatDate(visit.visitDate)}</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleIssueSample}>
            + Issue Sample
          </button>
          <button className="btn-secondary" onClick={handleEdit}>
            Edit Visit
          </button>
          <button className="btn-secondary" onClick={handleBack}>
            Back to List
          </button>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-card">
          <h2 className="card-title">Visit Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label className="detail-label">Visit Date</label>
              <p className="detail-value">{formatDate(visit.visitDate)}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Doctor</label>
              <p className="detail-value">{visit.doctorName || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Specialty</label>
              <p className="detail-value">{visit.doctor?.specialty || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Hospital</label>
              <p className="detail-value">{visit.doctor?.hospital || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Sales Representative</label>
              <p className="detail-value">{visit.user?.name || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Rep Email</label>
              <p className="detail-value">{visit.user?.email || 'N/A'}</p>
            </div>
            {visit.notes && (
              <div className="detail-item detail-item-full">
                <label className="detail-label">Visit Notes</label>
                <p className="detail-value">{visit.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="detail-card">
          <h2 className="card-title">Samples Issued During This Visit</h2>
          {isSamplesLoading ? (
            <LoadingSpinner />
          ) : samples && samples.length > 0 ? (
            <Table
              columns={sampleColumns}
              data={samples}
              emptyMessage="No samples issued during this visit"
            />
          ) : (
            <div className="empty-state">
              <p>📦 No samples issued during this visit</p>
              <button className="btn-primary" onClick={handleIssueSample} style={{ marginTop: '16px' }}>
                Issue Sample
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitDetail;

