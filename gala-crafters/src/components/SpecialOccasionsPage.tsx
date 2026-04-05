import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ServicesSlider, { ServiceItem } from './ServicesSlider';
import ClientTestimonials from './ClientTestimonials';
import LocationsSection from './LocationsSection';
import PackageDetailsModal from './PackageDetailsModal';
import ReservationModal from './ReservationModal';

// Assets
import heroBg from '../assets/Vintage-Gold.jpg'; 
import img1 from '../assets/glamour-2.jpg'; 
import img2 from '../assets/glamour-3.jpg'; 
import img3 from '../assets/Vintage-Gold-2.jpg'; 
import img4 from '../assets/glamour-4.jpg';
import img5 from '../assets/DSC9849.jpg';
import portraitEventImg from '../assets/img1.jpg';
import { FaGlassCheers, FaMusic } from "react-icons/fa";

const sliderImages = [heroBg, img1, img2, img3];
const occasionsGalleryImages = [heroBg, img1, img2, img3, img4, heroBg, img1, img2];

function SpecialOccasionsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'specialIntimate' | 'specialGrand' | 'specialLegacy'>('specialIntimate');
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

  const openPackageModal = (type: 'specialIntimate' | 'specialGrand' | 'specialLegacy') => {
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

  const specialServices: ServiceItem[] = [
    {
      title: "The Intimate Set",
      desc: "A refined and elegant package for your most cherished family milestones. Perfect for anniversaries and private gatherings.",
      link: "#",
      bg: heroBg,
      onClick: () => openPackageModal('specialIntimate')
    },
    {
      title: "The Grand Set",
      desc: "An elevated celebration with carving stations, memory lane photowall, and our signature two-layered milestone cake.",
      link: "#",
      bg: img1,
      onClick: () => openPackageModal('specialGrand')
    },
    {
      title: "The Legacy Set",
      desc: "Our most grand masterwork featuring dual carving stations, palatial styling, and full-scale tribute production.",
      link: "#",
      bg: img2,
      onClick: () => openPackageModal('specialLegacy')
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
          <div className="events-overlay" style={{ background: 'rgba(0, 0, 0, 0.45)' }}></div>

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
            <span className="events-overline">SPECIAL OCCASIONS & MILESTONES</span>
            <h2 className="events-main-title">
              <span className="italic-text">Unforgettable</span> <br />
              <span className="gold-text">Moments</span>
            </h2>
            <p>
              Celebrate life's grandest milestones with elegance and style. Whether it's a golden anniversary, an exclusive private gala, or a sophisticated soirée, we craft bespoke events tailored to your unique vision.
            </p>
          </div>
        </div>
      </section>

      {/* 2. GALLERY SECTION */}
      <section className="debut-gallery-section" style={{ padding: '80px 0' }}>
        <div className="debut-gallery-header" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '42px', color: '#c49a2c', marginBottom: '15px', fontWeight: 'bold' }}>Gala Crafters Special Events</h2>
          <div className="gold-line" style={{ margin: '15px auto 25px auto' }}></div>
          <p>
            Every milestone deserves a celebration that is as extraordinary as the occasion itself. At Gala Crafters, we understand that special events are intensely personal. From intimate vow renewals and extravagant birthday bashes to high-profile private gatherings, our dedicated event specialists work tirelessly to ensure your celebration is flawless, luxurious, and truly unforgettable.
          </p>
        </div>
        <div style={{ padding: '0 5%', maxWidth: '1600px', margin: '0 auto' }}>
          <div className="services-grid">
            {occasionsGalleryImages.map((image, index) => (
              <motion.div 
                key={index}
                className="service-item"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.15 }}
              >
                <div className="image-container">
                  <img src={image} alt={`Occasion Layout ${index + 1}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="debut-experience-section">
        <div className="debut-experience-container">

          <div className="debut-experience-text">
            <h2>The Bespoke Experience</h2>
            <div className="gold-line" style={{ margin: '0 0 20px 0' }}></div>

            <p>
              From selecting an exclusive venue and curating an exquisite gourmet menu to orchestrating breathtaking floral designs and atmospheric lighting, your event will be masterfully crafted. Gala Crafters provides top-tier full-service solutions for exclusive milestones:
            </p>
          </div>

          <div className="debut-experience-image">
            <img src={portraitEventImg} alt="Special Occasion Event" />
          </div>

        </div>

        <div className="container debut-traditions-grid">

          <div className="tradition-card">
            <FaGlassCheers className="tradition-icon" />
            <h3>Fine Dining & Mixology</h3>
            <p>
              Elevate your celebration with a customized culinary journey featuring gourmet dishes, elegant hors d'oeuvres, and signature cocktails. Our expert chefs and mixologists ensure that every sip and bite matches the grandeur of your event.
            </p>
          </div>

          <div className="tradition-card">
            <FaMusic className="tradition-icon" />
            <h3>Ambiance & Entertainment</h3>
            <p>
              Set the perfect mood with customized styling, lush decors, and curated entertainment. Whether you desire a live jazz band, a classical string quartet, or renowned DJs, we handle every detail to keep your guests captivated all night.
            </p>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="why-choose-section">
        <div className="why-choose-container">

          <div className="why-choose-image">
            <img src={img3} alt="Exclusive Event Setting" />
          </div>

          <div className="why-choose-content">
            <h2>Why Choose Gala Crafters for Life's Milestones</h2>
            <div className="gold-line" style={{ margin: '0 0 20px 0' }}></div>

            <p>
              Planning a high-end celebration requires unparalleled expertise and access to the finest suppliers in the industry. Our event planning experts collaborate with you closely to ensure that every aspect of your celebration is planned with precision and creativity. We manage all logistics so that you can step into your event as an honored guest and savor every precious moment.
            </p>

            <p>
              From customized invitations and luxury transportation to VIP guest coordination and specialized lighting, our bespoke services guarantee an affair that exceeds expectations. Inquire with us today to start planning the celebration of a lifetime!
            </p>
          </div>

        </div>
      </section>

      <ServicesSlider 
        title="Special Celebration Packages" 
        desc="Choose from our expertly crafted packages designed to elevate your milestones with cinematic flair and gourmet excellence."
        services={specialServices}
      />

      <ClientTestimonials />

      <LocationsSection />

      {/* Package & Reservation Modals */}
      <PackageDetailsModal 
        isOpen={showPackageModal} 
        onClose={closePackageModal} 
        packageType={selectedPackage as any}
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

export default SpecialOccasionsPage;
