import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Global Layouts/Components
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import CustomerLayout from './components/layouts/CustomerLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterCustomer from './pages/auth/RegisterCustomer';
import RegisterNursery from './pages/auth/RegisterNursery';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import PlantListing from './pages/customer/PlantListing';
import PlantDetails from './pages/customer/PlantDetails';
import CategoryList from './pages/customer/CategoryList';
import NurseryDashboard from './pages/nursery/NurseryDashboard';
import MyNursery from './pages/nursery/MyNursery';
import PlantManagement from './pages/nursery/PlantManagement';
import PlantForm from './pages/nursery/PlantForm';
import Inventory from './pages/nursery/Inventory';
import NurseryOwnerLayout from './components/layouts/NurseryOwnerLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

import './App.css';



const NotFoundPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>404 - Page Not Found</h2>
  </div>
);

const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p>Coming Soon</p>
  </div>
);

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes with standard Navbar */}
      <Route element={<><Navbar /><div className="container" style={{ minHeight: 'calc(100vh - 64px)' }}><OutletWrapper /></div></>}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/customer" element={<RegisterCustomer />} />
        <Route path="/register/nursery" element={<RegisterNursery />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Non-Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Nursery Owner Routes with NurseryOwnerLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['ROLE_NURSERY_OWNER']} />}>
          <Route element={<NurseryOwnerLayout />}>
            <Route path="/nursery/dashboard" element={<NurseryDashboard />} />
            <Route path="/nursery/profile" element={<MyNursery />} />
            <Route path="/nursery/plants" element={<PlantManagement />} />
            <Route path="/nursery/plants/add" element={<PlantForm />} />
            <Route path="/nursery/plants/:plantId/edit" element={<PlantForm />} />
            <Route path="/nursery/inventory" element={<Inventory />} />
            
            <Route path="/nursery/orders" element={<PlaceholderPage title="Orders" />} />
            <Route path="/nursery/sales" element={<PlaceholderPage title="Sales" />} />
          </Route>
        </Route>
      </Route>

      {/* Customer Routes with CustomerLayout (Sidebar) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['ROLE_CUSTOMER']} />}>
          <Route element={<CustomerLayout />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/plants" element={<PlantListing />} />
            <Route path="/customer/plants/:plantId" element={<PlantDetails />} />
            <Route path="/customer/categories" element={<CategoryList />} />
            
            {/* Placeholders for unemplemented features */}
            <Route path="/customer/orders" element={<PlaceholderPage title="Orders" />} />
            <Route path="/customer/cart" element={<PlaceholderPage title="Cart" />} />
            <Route path="/customer/profile" element={<PlaceholderPage title="Profile" />} />
            <Route path="/customer/ai-diagnosis" element={<PlaceholderPage title="AI Plant Diagnosis" />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

// Simple wrapper to render children inside the standard layout
const OutletWrapper = () => <Outlet />;

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
