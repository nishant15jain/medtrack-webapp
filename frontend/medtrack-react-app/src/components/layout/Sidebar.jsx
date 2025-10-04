import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
      roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.REP]
    },
    {
      name: 'Doctors',
      path: '/doctors',
      icon: '👨‍⚕️',
      roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.REP]
    },
    {
      name: 'Products',
      path: '/products',
      icon: '💊',
      roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.REP]
    },
    {
      name: 'Visits',
      path: '/visits',
      icon: '📅',
      roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.REP]
    },
    {
      name: 'Samples',
      path: '/samples',
      icon: '📦',
      roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.REP]
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: '🛒',
      roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.REP]
    },
    {
      name: 'Users',
      path: '/users',
      icon: '👥',
      roles: [USER_ROLES.ADMIN]
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

