# MedTrack Pro - Setup Instructions

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:5173

## Getting Started

1. First register an admin user at `/register`
2. Then login with your credentials at `/login`
3. You'll be redirected to the dashboard

## ✅ Completed Features (Phase 1, 2 & 3)

### Phase 1 - Authentication & Foundation
- ✅ JWT-based authentication
- ✅ Role-based access control (ADMIN, MANAGER, REP)
- ✅ Protected routes
- ✅ Login/Register pages
- ✅ Role-based dashboard
- ✅ Layout with Navbar and Sidebar

### Phase 2 - Core CRUD Operations
- ✅ **Doctors Module** - Full CRUD with search
- ✅ **Products Module** - Full CRUD with search
- ✅ **Users Module** - User management with role filtering and activate/deactivate
- ✅ Reusable components (Table, Modal, SearchBar)
- ✅ Error handling and loading states
- ✅ Confirmation modals for delete operations

### Phase 3 - Visit & Sample Tracking
- ✅ **Visits Module** - Track doctor visits with date filtering
- ✅ **Samples Module** - Issue and track product samples
- ✅ DateRangePicker component for filtering
- ✅ Visit-to-Sample linking
- ✅ Auto-fill doctor from visit selection
- ✅ Visit details with associated samples

## Available Routes

### Public Routes
- `/login` - Login page
- `/register` - Admin registration

### Protected Routes (All Roles)
- `/dashboard` - Role-based dashboard
- `/doctors` - Doctor list with search
- `/doctors/:id` - Doctor details
- `/products` - Product list with search
- `/products/:id` - Product details

### ADMIN-Only Routes
- `/doctors/new` - Add new doctor
- `/doctors/:id/edit` - Edit doctor
- `/products/new` - Add new product
- `/products/:id/edit` - Edit product
- `/users` - User management
- `/users/new` - Add new user

### Visit Routes
- `/visits` - Visit list with date filtering
- `/visits/new` - Log new visit
- `/visits/:id` - Visit details with samples
- `/visits/:id/edit` - Edit visit

### Sample Routes
- `/samples` - Sample list with date filtering
- `/samples/new` - Issue new sample
- `/samples/:id/edit` - Edit sample

## Backend Configuration

Make sure your Spring Boot backend is running on `http://localhost:8080`

If your backend runs on a different port, update `API_BASE_URL` in:
`src/utils/constants.js`

## User Roles

- **ADMIN**: Full access to all features, can manage users, doctors, products
- **MANAGER**: Can view all data, access reports
- **REP**: Can view doctors and products, log visits, issue samples

