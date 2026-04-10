import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ServicesSlider, { ServiceItem } from './ServicesSlider';
import ClientTestimonials from './ClientTestimonials';
import LocationsSection from './LocationsSection';
import PackageDetailsModal from './PackageDetailsModal';
import ReservationModal from './ReservationModal';

// Assets
import heroBg from '../assets/banner-1.jpg'; 
import img1 from '../assets/DSC9724.jpg'; 
import img2 from '../assets/DSC9804.jpg'; 
import img3 from '../assets/banner-2.jpg'; 
import img4 from '../assets/img1a.jpg';
import { FaBriefcase, FaHandshake } from "react-icons/fa";

const sliderImages = [heroBg, img1, img2, img3];
const corporateGalleryImages = [img1, img2, img3, img4, img1, img2, img3, img4];

function CorporateEventPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'corporateSetA' | 'corporateSetB' | 'corporateSetC'>('corporateSetA');
  const [reservationData, setReservationData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const openPackageModal = (type: 'corporateSetA' | 'corporateSetB' | 'corporateSetC') => {
    setSelectedPackage(type);
    setShowPackageModal(true);
  };

  const closePackageModal = () => {
    setShowPackageModal(false);
  };

  const handleReserve = (data: any) => {
    setReservationData(data);
    setShowPackageModal(false);
    setShowReservationModal(true);
  };

  const handleBackToPackage = () => {
    setShowReservationModal(false);
    setShowPackageModal(true);
  };

  const corporateServices: ServiceItem[] = [
    {
      title: "Corporate Set A",
      desc: "Our premier selection featuring a full course buffet, executive setup, and VIP seated service for professional gatherings.",
      link: "#",
      bg: img1,
      onClick: () => openPackageModal('corporateSetA')
    },
    {
      title: "Corporate Set B",
      desc: "An elevated experience with specialized carving stations and premium bar setups for grander corporate milestones.",
      link: "#",
      bg: img2,
      onClick: () => openPackageModal('corporateSetB')
    },
    {
      title: "Corporate Set C",
      desc: "The ultimate corporate gala experience with dual carving stations, wine service, and full-scale event production.",
      link: "#",
      bg: img3,
      onClick: () => openPackageModal('corporateSetC')
    }
  ];

  return (
    <div className="debut-page-wrapper" style={{ backgroundColor: '#ffffff', paddingBottom: '0px' }}>

      {/* 1. HERO BANNER (SLIDER OVERLAY) */}
      <section className="events-hero-section">
        <div className="events-bg-slider">
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`slider-bg ${index === currentIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            ></div>
          ))}
          <div className="events-overlay"></div>

          {/* SLIDER PAGINATION DOTS */}
          <div className="slider-dots-container">
            {sliderImages.map((_, index) => (
              <div
                key={index}
                className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              ></div>
            ))}
          </div>
        </div>

        <div className="container events-content-wrapper">
          <div className="events-text-box">
            <span className="events-overline">CORPORATE EVENT EXPERTISE</span>
            <h2 className="events-main-title">
              <span className="italic-text">Professional</span> <br />
              <span className="gold-text">Excellence</span>
            </h2>
            <p>
              Elevate your corporate gatherings with a touch of sophistication. From grand galas to intimate executive dinners, we deliver flawless execution and bespoke styling that leave a lasting impression.
            </p>
          </div>
        </div>
      </section>

      {/* 2. GALLERY SECTION (WITH FULL TEXT RESTORED) */}
      <section className="debut-gallery-section" style={{ padding: '80px 0' }}>
        <div className="debut-gallery-header" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '42px', color: '#c49a2c', marginBottom: '15px', fontWeight: 'bold' }}>Gala Crafters Corporate Catering Services</h2>
          <div className="gold-line" style={{ margin: '15px auto 25px auto' }}></div>
          <p>
            Whether hosting a product launch, an annual gala, or an awards ceremony, your corporate event should reflect your brand’s standards and success. With Gala Crafters as your partner, you can expect nothing short of excellence. Our bespoke approach ensures that every detail aligns with your corporate vision, delivering an exceptional experience for your guests.
          </p>
        </div>
        <div style={{ padding: '0 5%', maxWidth: '1600px', margin: '0 auto' }}>
          <div className="services-grid">
            {corporateGalleryImages.map((image, index) => (
              <motion.div 
                key={index}
                className="service-item"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.15 }}
              >
                <div className="image-container">
                  <img src={image} alt={`Corporate Layout ${index + 1}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="debut-experience-section">
        <div className="debut-experience-container">

          <div className="debut-experience-text">
            <h2>The Corporate Experience</h2>
            <div className="gold-line" style={{ margin: '0 0 20px 0' }}></div>

            <p>
              From securing the ideal venue and curating a refined menu to executing flawless event styling and coordinating intricate logistics, your corporate event will be meticulously planned down to the last detail. Gala Crafters stays ahead of industry trends and brings expertise to essential corporate event components:
            </p>
          </div>

          <div className="debut-experience-image">
            <img src={img1} alt="Corporate Event" />
          </div>

        </div>

        <div className="container debut-traditions-grid">

          <div className="tradition-card">
            <FaBriefcase className="tradition-icon" />
            <h3>Professional Planning</h3>
            <p>
              We work closely with your team to understand your objectives and brand identity. From concept to execution, our dedicated coordinators plan every aspect of your event to ensure a seamless and impactful experience for your clients and employees.
            </p>
          </div>

          <div className="tradition-card">
            <FaHandshake className="tradition-icon" />
            <h3>Tailored Experiences</h3>
            <p>
              Through customized menus and sophisticated styling, we create experiences that foster connection and celebration. We ensure that every guest feels valued and that your corporate milestones are recognized appropriately.
            </p>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="why-choose-section">
        <div className="why-choose-container">

          <div className="why-choose-image">
            <img src={img3} alt="Corporate Event Setting" />
          </div>

          <div className="why-choose-content">
            <h2>Why Choose Gala Crafters for Your Corporate Events</h2>
            <div className="gold-line" style={{ margin: '0 0 20px 0' }}></div>

            <p>
              Our event planning experts collaborate with you to ensure every aspect of your corporate function is executed flawlessly. Our reputation is built on our ability to coordinate and provide world-class catering services that align with the rigorous standards of our corporate clients, all without compromising quality. Your team can focus on networking and celebrating achievements while we handle the finer details.
            </p>

            <p>
              Premium food selections, exquisite table settings, specialized audiovisual coordination, and professionally trained staff are just a few of the services we offer. Inquire with us to discover how we can elevate your next corporate gathering!
            </p>
          </div>

        </div>
      </section>

      <ServicesSlider 
        title="Corporate Packages" 
        desc="Elevate your corporate events with our expertly curated buffet selections and professional service teams. Choose the package that best fits your business goals."
        services={corporateServices}
      />

      <ClientTestimonials packageId={9} />

      <LocationsSection />

      {/* Package & Reservation Modals */}
      <PackageDetailsModal 
        isOpen={showPackageModal} 
        onClose={closePackageModal} 
        packageType={selectedPackage}
        onReserve={handleReserve}
      />

      <ReservationModal 
        isOpen={showReservationModal} 
        onClose={() => setShowReservationModal(false)}
        data={reservationData}
        onBack={handleBackToPackage}
      />

    </div>
  );
}

export default CorporateEventPage;