import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Philosophy />
    <Services />
  </>
);

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />

        {/* Main Services Page */}
        <Route path="/services" element={<ServicesPage />} />

        {/* === UPDATED: Wedding Page Route === */}
        <Route path="/services/weddings" element={<WeddingPage />} />

        {/* Other dropdown links (still pointing to the main Services page for now) */}
        <Route path="/corporate" element={<CorporateEventPage />} />
        <Route path="/debut" element={<DebutPage />} />
        <Route path="/services/childrens-party" element={<ServicesPage />} />
        <Route path="/services/special-occasions" element={<ServicesPage />} />
        <Route path="/services/packages" element={<ServicesPage />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;