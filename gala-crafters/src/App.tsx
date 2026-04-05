import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import EventsPage from './components/EventsPage';
import ServicesPage from './components/ServicesPage';
import WeddingPage from './components/WeddingPage'; 
import CorporateEventPage from './components/CorporateEventPage';
import DebutPage from './components/DebutPage';
import ChildrensPartyPage from './components/ChildrensPartyPage';
import SpecialOccasionsPage from './components/SpecialOccasionsPage';
import AboutUsPage from './components/AboutUsPage';
import ContactUsPage from './components/ContactUsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SignUpPage from './components/SignUpPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import AccountPage from './components/AccountPage';
import SettingsPage from './components/SettingsPage';
import MessagesPage from './components/MessagesPage';
import TransactionHistory from './components/TransactionHistory';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './api/auth';

// Admin Imports
import AdminDashboard from './components/Admin/AdminDashboard'; 
import AdminBookings from './components/Admin/AdminBookings';
import AdminUsers from './components/Admin/AdminUsers';
import AdminMessages from './components/Admin/AdminMessages';
import AdminLoginPage from './components/Admin/AdminLoginPage';
import AdminPackages from './components/Admin/AdminPackages';
import AdminDiscounts from './components/Admin/AdminDiscounts';
import AdminReviews from './components/Admin/AdminReviews';
import AdminReports from './components/Admin/AdminReports';

import Hero from './components/Hero';
import Services from './components/Services';
import FloatingChat from './components/FloatingChat';
import './App.css';

const Home = () => (
  <>
    <div className="container">
      <Hero />
    </div>
    <Services />
  </>
);

const AppLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.toLowerCase().startsWith('/admin');
  const isAuth = location.pathname.toLowerCase().startsWith('/login') || 
                 location.pathname.toLowerCase().startsWith('/signup') ||
                 location.pathname.toLowerCase().startsWith('/reset-password');

  React.useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
    };
    checkAuth();
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  return (
    <>
      {!isAdmin && !isAuth && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />

        {/* Main Services Page */}
        <Route path="/services" element={<ServicesPage />} />

        {/* Account Settings & Transactions */}
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />

        {/* === UPDATED: Wedding Page Route === */}
        <Route path="/services/weddings" element={<WeddingPage />} />

        {/* Other dropdown links */}
        <Route path="/corporate" element={<CorporateEventPage />} />
        <Route path="/debut" element={<DebutPage />} />
        <Route path="/services/childrens-party" element={<ChildrensPartyPage />} />
        <Route path="/services/special-occasions" element={<SpecialOccasionsPage />} />
        <Route path="/services/packages" element={<ServicesPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute requiredRole="admin"><AdminBookings /></ProtectedRoute>} />
        <Route path="/admin/packages" element={<ProtectedRoute requiredRole="admin"><AdminPackages /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute requiredRole="admin"><AdminMessages /></ProtectedRoute>} />
        <Route path="/admin/discounts" element={<ProtectedRoute requiredRole="admin"><AdminDiscounts /></ProtectedRoute>} />
        <Route path="/admin/reviews" element={<ProtectedRoute requiredRole="admin"><AdminReviews /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><AdminReports /></ProtectedRoute>} />
      </Routes>

      {!isAdmin && !isAuth && <Footer />}
      {!isAdmin && !isAuth && isLoggedIn && <FloatingChat />}
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