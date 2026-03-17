import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import EventsPage from './components/EventsPage';
import ServicesPage from './components/ServicesPage';
import WeddingPage from './components/WeddingPage'; // <--- 1. ADD THIS NEW IMPORT!
import CorporateEventPage from './components/CorporateEventPage';
import DebutPage from './components/DebutPage';
import AboutUsPage from './components/AboutUsPage';
import ContactUsPage from './components/ContactUsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SignUpPage from './components/SignUpPage';
import AccountPage from './components/AccountPage';
import TransactionHistory from './components/TransactionHistory';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Imports
import AdminDashboard from './components/Admin/AdminDashboard'; 
import AdminBookings from './components/Admin/AdminBookings';
import AdminUsers from './components/Admin/AdminUsers';
import AdminMessages from './components/Admin/AdminMessages';
import AdminLoginPage from './components/Admin/AdminLoginPage';
import AdminPackages from './components/Admin/AdminPackages'; // We will create this next

// Homepage Sections
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Services from './components/Services';
import './App.css';

const Home = () => (
  <>
    <div className="container">
      <Hero />
    </div>
    <Services />
    <Philosophy />
  </>
);

const AppLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.toLowerCase().startsWith('/admin');
  const isAuth = location.pathname.toLowerCase().startsWith('/login') || location.pathname.toLowerCase().startsWith('/signup');

  return (
    <>
      {!isAdmin && !isAuth && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />

        {/* Main Services Page */}
        <Route path="/services" element={<ServicesPage />} />

        {/* Account Settings & Transactions */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />

        {/* === UPDATED: Wedding Page Route === */}
        <Route path="/services/weddings" element={<WeddingPage />} />

        {/* Other dropdown links (still pointing to the main Services page for now) */}
        <Route path="/corporate" element={<CorporateEventPage />} />
        <Route path="/debut" element={<DebutPage />} />
        <Route path="/services/childrens-party" element={<ServicesPage />} />
        <Route path="/services/special-occasions" element={<ServicesPage />} />
        <Route path="/services/packages" element={<ServicesPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute requiredRole="admin"><AdminBookings /></ProtectedRoute>} />
        <Route path="/admin/packages" element={<ProtectedRoute requiredRole="admin"><AdminPackages /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute requiredRole="admin"><AdminMessages /></ProtectedRoute>} />
      </Routes>

      {!isAdmin && !isAuth && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;