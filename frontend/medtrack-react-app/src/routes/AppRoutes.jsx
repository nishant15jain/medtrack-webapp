import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/Dashboard';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import { USER_ROLES } from '../utils/constants';

// Doctor pages
import DoctorList from '../pages/doctors/DoctorList';
import DoctorForm from '../pages/doctors/DoctorForm';
import DoctorDetail from '../pages/doctors/DoctorDetail';

// Product pages
import ProductList from '../pages/products/ProductList';
import ProductForm from '../pages/products/ProductForm';
import ProductDetail from '../pages/products/ProductDetail';

// User pages
import UserList from '../pages/users/UserList';
import UserForm from '../pages/users/UserForm';
import UserDetail from '../pages/users/UserDetail';

// Visit pages
import VisitList from '../pages/visits/VisitList';
import VisitForm from '../pages/visits/VisitForm';
import VisitDetail from '../pages/visits/VisitDetail';

// Sample pages
import SampleList from '../pages/samples/SampleList';
import SampleForm from '../pages/samples/SampleForm';

// Order pages
import OrderList from '../pages/orders/OrderList';
import OrderForm from '../pages/orders/OrderForm';
import OrderDetail from '../pages/orders/OrderDetail';

// Location pages
import LocationList from '../pages/locations/LocationList';
import LocationForm from '../pages/locations/LocationForm';
import BulkLocationForm from '../pages/locations/BulkLocationForm';

// Visit Start
import VisitStartForm from '../pages/visits/VisitStartForm';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />

      {/* Protected routes with layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Doctor routes */}
        <Route path="/doctors" element={<DoctorList />} />
        <Route 
          path="/doctors/new" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <DoctorForm />
            </ProtectedRoute>
          } 
        />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route 
          path="/doctors/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <DoctorForm />
            </ProtectedRoute>
          } 
        />

        {/* Product routes */}
        <Route path="/products" element={<ProductList />} />
        <Route 
          path="/products/new" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <ProductForm />
            </ProtectedRoute>
          } 
        />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route 
          path="/products/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <ProductForm />
            </ProtectedRoute>
          } 
        />

        {/* User routes - ADMIN and MANAGER */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
              <UserList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/new" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <UserForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/:id" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
              <UserDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
              <UserForm />
            </ProtectedRoute>
          } 
        />

        {/* Visit routes */}
        <Route path="/visits" element={<VisitList />} />
        <Route path="/visits/new" element={<VisitForm />} />
        <Route path="/visits/start" element={<VisitStartForm />} />
        <Route path="/visits/:id" element={<VisitDetail />} />
        <Route path="/visits/:id/edit" element={<VisitForm />} />

        {/* Sample routes */}
        <Route path="/samples" element={<SampleList />} />
        <Route path="/samples/new" element={<SampleForm />} />
        <Route path="/samples/:id/edit" element={<SampleForm />} />

        {/* Order routes */}
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/new" element={<OrderForm />} />
        <Route path="/orders/:id" element={<OrderDetail />} />

        {/* Location routes - ADMIN only */}
        <Route 
          path="/locations" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <LocationList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/locations/new" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <LocationForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/locations/bulk" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <BulkLocationForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/locations/edit/:id" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <LocationForm />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Not Found */}
      <Route 
        path="*" 
        element={
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{ marginBottom: '16px' }}>404 - Page Not Found</h2>
            <p style={{ color: '#6b7280' }}>
              The page you're looking for doesn't exist.
            </p>
          </div>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;

