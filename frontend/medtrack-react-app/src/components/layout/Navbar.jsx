import { useAuth } from '../../context/AuthContext';
import { ROLE_DESCRIPTIONS } from '../../utils/constants';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h2 className="navbar-brand">MedTrack Pro</h2>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user?.name || user?.email || 'User'}</span>
            </div>
            <div className="user-role-badge">{user?.role}</div>
          </div>
          
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

