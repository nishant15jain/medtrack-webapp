import { useAuth } from '../context/AuthContext';
import { USER_ROLES, ROLE_DESCRIPTIONS } from '../utils/constants';
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboardStats } from '../api/dashboardApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Fetch admin dashboard stats if user is ADMIN
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: getAdminDashboardStats,
    enabled: user?.role === USER_ROLES.ADMIN,
    refetchInterval: 60000, // Refetch every minute
  });

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return {
          title: 'Admin Dashboard',
          description: 'You have full access to all system features.',
          features: [
            '✅ Manage all users, doctors, and products',
            '✅ View all visits and samples',
            '✅ Access comprehensive reports',
            '✅ Configure system settings'
          ],
          quickActions: [
            { label: 'Manage Users', path: '/users', icon: '👥' },
            { label: 'Add Doctor', path: '/doctors', icon: '👨‍⚕️' },
            { label: 'Add Product', path: '/products', icon: '💊' },
            { label: 'View Reports', path: '/samples', icon: '📊' }
          ]
        };
      
      case USER_ROLES.MANAGER:
        return {
          title: 'Manager Dashboard',
          description: 'Monitor team performance and track activities.',
          features: [
            '✅ View team visits and samples',
            '✅ Access doctor and product lists',
            '✅ Generate team reports',
            '✅ Monitor sales activities'
          ],
          quickActions: [
            { label: 'Team Visits', path: '/visits', icon: '📅' },
            { label: 'Sample Reports', path: '/samples', icon: '📦' },
            { label: 'Doctors', path: '/doctors', icon: '👨‍⚕️' },
            { label: 'Products', path: '/products', icon: '💊' }
          ]
        };
      
      case USER_ROLES.REP:
        return {
          title: 'Representative Dashboard',
          description: 'Log your visits and manage sample distribution.',
          features: [
            '✅ Log doctor visits',
            '✅ Issue product samples',
            '✅ View your visit history',
            '✅ Track your samples'
          ],
          quickActions: [
            { label: 'Log Visit', path: '/visits', icon: '📅' },
            { label: 'Issue Sample', path: '/samples', icon: '📦' },
            { label: 'My Visits', path: '/visits', icon: '📝' },
            { label: 'Doctors', path: '/doctors', icon: '👨‍⚕️' }
          ]
        };
      
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to MedTrack Pro',
          features: [],
          quickActions: []
        };
    }
  };

  const content = getRoleBasedContent();

  // Render admin-specific dashboard
  const renderAdminDashboard = () => {
    if (statsLoading) {
      return (
        <div className="dashboard-loading">
          <LoadingSpinner />
        </div>
      );
    }

    if (statsError) {
      return (
        <ErrorMessage 
          message="Failed to load dashboard statistics" 
          details={statsError.message} 
        />
      );
    }

    return (
      <>
        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-users">
            <div className="stat-icon">👥</div>
            <div className="stat-details">
              <h3 className="stat-value">{dashboardStats?.totalUsers || 0}</h3>
              <p className="stat-label">Total Users</p>
            </div>
          </div>
          
          <div className="stat-card stat-doctors">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-details">
              <h3 className="stat-value">{dashboardStats?.totalDoctors || 0}</h3>
              <p className="stat-label">Total Doctors</p>
            </div>
          </div>
          
          <div className="stat-card stat-products">
            <div className="stat-icon">💊</div>
            <div className="stat-details">
              <h3 className="stat-value">{dashboardStats?.totalProducts || 0}</h3>
              <p className="stat-label">Total Products</p>
            </div>
          </div>
          
          <div className="stat-card stat-visits">
            <div className="stat-icon">📅</div>
            <div className="stat-details">
              <h3 className="stat-value">{dashboardStats?.recentVisitsCount || 0}</h3>
              <p className="stat-label">Recent Visits (7 days)</p>
            </div>
          </div>
          
          <div className="stat-card stat-reps">
            <div className="stat-icon">🚀</div>
            <div className="stat-details">
              <h3 className="stat-value">{dashboardStats?.activeRepsCount || 0}</h3>
              <p className="stat-label">Active REPs This Month</p>
            </div>
          </div>
        </div>

        {/* Top Products Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">📊 Top Products by Sample Quantity</h2>
          </div>
          <div className="card-body">
            {dashboardStats?.topProducts?.length > 0 ? (
              <div className="top-products-list">
                {dashboardStats.topProducts.map((product, index) => (
                  <div key={product.productId} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <h4 className="product-name">{product.productName}</h4>
                      <p className="product-details">
                        {product.category} • {product.manufacturer}
                      </p>
                    </div>
                    <div className="product-quantity">
                      <span className="quantity-value">{product.totalSamples}</span>
                      <span className="quantity-label">samples</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No sample data available</p>
            )}
          </div>
        </div>

        {/* Recent Visits Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">🕒 Recent Visits (Last 7 Days)</h2>
          </div>
          <div className="card-body">
            {dashboardStats?.recentVisits?.length > 0 ? (
              <div className="recent-visits-list">
                {dashboardStats.recentVisits.map((visit) => (
                  <div key={visit.visitId} className="visit-item">
                    <div className="visit-date">
                      {new Date(visit.visitDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="visit-info">
                      <h4 className="visit-doctor">{visit.doctorName}</h4>
                      <p className="visit-details">
                        <span className="rep-name">{visit.repName}</span>
                        {visit.purpose && visit.purpose !== 'No notes' && (
                          <span className="visit-purpose"> • {visit.purpose}</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No recent visits</p>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{content.title}</h1>
        <p className="dashboard-description">{content.description}</p>
      </div>

      <div className="dashboard-grid">
        {user?.role === USER_ROLES.ADMIN ? (
          // Admin Dashboard with Analytics
          renderAdminDashboard()
        ) : (
          // Default Dashboard for other roles
          <>
            {/* Role Info Card */}
            <div className="dashboard-card card-full">
              <div className="card-header">
                <h2 className="card-title">Your Role</h2>
              </div>
              <div className="card-body">
                <div className="role-info">
                  <div className="role-badge-large">{user?.role}</div>
                  <p className="role-description-large">
                    {ROLE_DESCRIPTIONS[user?.role]}
                  </p>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Available Features</h2>
              </div>
              <div className="card-body">
                <ul className="features-list">
                  {content.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Quick Actions</h2>
              </div>
              <div className="card-body">
                <div className="quick-actions">
                  {content.quickActions.map((action, index) => (
                    <a
                      key={index}
                      href={action.path}
                      className="quick-action-btn"
                    >
                      <span className="action-icon">{action.icon}</span>
                      <span className="action-label">{action.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

