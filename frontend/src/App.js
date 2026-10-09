import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Global Layouts/Components
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import CustomerLayout from './components/layouts/CustomerLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterCustomer from './pages/auth/RegisterCustomer';
import RegisterNursery from './pages/auth/RegisterNursery';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import PlantListing from './pages/customer/PlantListing';
import PlantDetails from './pages/customer/PlantDetails';
import CategoryList from './pages/customer/CategoryList';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Payment from './pages/customer/Payment';
import OrderSuccess from './pages/customer/OrderSuccess';
import Orders from './pages/customer/Orders';
import OrderDetails from './pages/customer/OrderDetails';
import UserProfile from './pages/customer/UserProfile';
import AiDiagnosis from './pages/customer/AiDiagnosis';
import NearbyNurseries from './pages/customer/NearbyNurseries';

// Nursery Owner Pages
import NurseryDashboard from './pages/nursery/NurseryDashboard';
import MyNursery from './pages/nursery/MyNursery';
import PlantManagement from './pages/nursery/PlantManagement';
import PlantForm from './pages/nursery/PlantForm';
import Inventory from './pages/nursery/Inventory';
import NurseryOrders from './pages/nursery/NurseryOrders';
import NurserySales from './pages/nursery/NurserySales';
import NurseryOwnerLayout from './components/layouts/NurseryOwnerLayout';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

// Public
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
        <Route path="/nearby-nurseries" element={<NearbyNurseries />} />
        <Route path="/catalog" element={<PlantListing />} />
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
            <Route path="/nursery/orders" element={<NurseryOrders />} />
            <Route path="/nursery/sales" element={<NurserySales />} />
          </Route>
        </Route>
      </Route>

      {/* Customer Routes with CustomerLayout (Sidebar) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['ROLE_CUSTOMER']} />}>
          <Route element={<CustomerLayout />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/nearby-nurseries" element={<NearbyNurseries />} />
            <Route path="/customer/plants" element={<PlantListing />} />
            <Route path="/customer/plants/:plantId" element={<PlantDetails />} />
            <Route path="/customer/categories" element={<CategoryList />} />
            <Route path="/customer/cart" element={<Cart />} />
            <Route path="/customer/checkout" element={<Checkout />} />
            <Route path="/customer/payment" element={<Payment />} />
            <Route path="/customer/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/customer/orders" element={<Orders />} />
            <Route path="/customer/orders/:orderId" element={<OrderDetails />} />
            <Route path="/customer/profile" element={<UserProfile />} />
            <Route path="/customer/ai-diagnosis" element={<AiDiagnosis />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

const OutletWrapper = () => <Outlet />;

function App() {
  return (
    <AuthProvider>
      <Router>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
