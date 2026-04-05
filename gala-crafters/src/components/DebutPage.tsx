import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ServicesSlider from './ServicesSlider';
import ClientTestimonials from './ClientTestimonials';
import LocationsSection from './LocationsSection';
import PackageDetailsModal from './PackageDetailsModal';
import ReservationModal from './ReservationModal';

// Assets
import heroBg from '../assets/girl.jpg';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img5.jpg';
import img3 from '../assets/img3.jpg';
import { FaGift, FaRegHeart } from "react-icons/fa";

const sliderImages = [heroBg, img1, img2, img3];
const debutGalleryImages = [img1, img2, img3, heroBg, img1, img2, img3, heroBg];

function DebutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'debutIntimate' | 'debutClassy' | 'debutVogue'>('debutIntimate');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
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

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (['intimate', 'classy', 'vogue'].includes(hash)) {
        // Map simple hash to debut keys
        const fullType = `debut${hash.charAt(0).toUpperCase() + hash.slice(1)}` as any;
        setSelectedPackage(fullType);
        setIsModalOpen(true);
      } else if (!hash) {
        setIsModalOpen(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openPackageModal = (type: 'intimate' | 'classy' | 'vogue') => {
    window.location.hash = type;
  };

  const closePackageModal = () => {
    window.location.hash = '';
  };

  const handleOpenReservation = (data: any) => {
    setReservationData(data);
    setIsModalOpen(false);
    setIsReservationModalOpen(true);
  };

  const handleBackToPackage = () => {
    setIsReservationModalOpen(false);
    setIsModalOpen(true);
  };

  const debutServices = [
    {
      title: "Intimate",
      desc: "A beautifully personal debut focusing on tradition and elegance, designed for smaller gatherings that celebrate your special milestone.",
      link: "#",
      bg: img1,
      onClick: () => openPackageModal('intimate')
    },
    {
      title: "Classy",
      desc: "An elegant transition with specialized stations, premium seating, and dedicated service for your VIP guests and cherished traditions.",
      link: "#",
      bg: img2,
      onClick: () => openPackageModal('classy')
    },
    {
      title: "Vogue",
      desc: "Our most grand cinematic celebration. A lavish experience with welcome cocktails, dual carving stations, and full-scale signature production.",
      link: "#",
      bg: img3,
      onClick: () => openPackageModal('vogue')
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
            <span className="events-overline">DEBUT CATERING & SERVICES</span>
            <h2 className="events-main-title">
              <span className="italic-text">Coming of</span> <br />
              <span className="gold-text">Age</span>
            </h2>
            <p>
              The debut - which comes only once in every lifetime - is a cherished occasion that marks every woman's transcendence into early adulthood.
            </p>
          </div>
        </div>
      </section>

      {/* 2. GALLERY SECTION (WITH FULL TEXT RESTORED) */}
      <section className="debut-gallery-section" style={{ padding: '80px 0' }}>
        <div className="debut-gallery-header" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '42px', color: '#c49a2c', marginBottom: '15px', fontWeight: 'bold' }}>Gala Crafters Debut Catering Services</h2>
          <div className="gold-line" style={{ margin: '15px auto 25px auto' }}></div>
          <p>
            The debut - which comes only once in every lifetime - is a cherished occasion that marks every woman's transcendence into early adulthood. It's undoubtedly a very important part of life, and with Gala Crafters at your side you're sure to want for nothing during the affair. Our service's bespoke approach is sure to cater to every need, making every moment a worthwhile one.
          </p>
        </div>
        <div style={{ padding: '0 5%', maxWidth: '1600px', margin: '0 auto' }}>
          <div className="services-grid">
            {debutGalleryImages.map((image, index) => (
              <motion.div 
                key={index}
                className="service-item"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.15 }}
              >
                <div className="image-container">
                  <img src={image} alt={`Debut Layout ${index + 1}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="debut-experience-section">
        <div className="debut-experience-container">

          <div className="debut-experience-text">
            <h2>The Debut Experience</h2>
            <div className="gold-line" style={{ margin: '0 0 20px 0' }}></div>

            <p>
              From finding a venue and curating a menu to styling the entire event,
              making flower arrangements, and planning the “eighteen traditions,”
              your event will be meticulously bespoke down to the last detail.
              Gala Crafters is always updated on modern and traditional debut
              customs like the following:
            </p>
          </div>

          <div className="debut-experience-image">
            <img src={img1} alt="Debut Event" />
          </div>

        </div>

        <div className="container debut-traditions-grid">

          <div className="tradition-card">
            <FaRegHeart className="tradition-icon" />
            <h3>18 Roses</h3>
            <p>
              18 males are selected to waltz with the celebrant, each of them
              holding a long-stemmed rose to give to the debutante before their
              dance with her. The last dance is saved for the debutante’s father
              and concludes this special commemoration of each of the special
              males in her life.
            </p>
          </div>

          <div className="tradition-card">
            <FaGift className="tradition-icon" />
            <h3>18 Candles or 18 Treasures</h3>
            <p>
              Through the 18 candles or symbolic gifts, the debutante’s friends
              or relatives give her something symbolic of their love and
              relationship with her. The celebrant is reminded of all the
              people who value her and are proud to see her grow.
            </p>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="why-choose-section">
        <div className="why-choose-container">

          <div className="why-choose-image">
            <img src={img3} alt="Debut Event" />
          </div>

          <div className="why-choose-content">
            <h2>Why Choose Juan Carlo as Your Debut Caterer in the Philippines</h2>
            <div className="gold-line" style={{ margin: '0 0 20px 0' }}></div>

            <p>
              Our event planning experts will work with you to ensure that every aspect
              of your event is carefully planned. Our success is attributed to our
              capacity to coordinate and provide debut catering services in line with
              the specific preferences of our clients, all without compromising quality.
              Thus, debutantes do not need to be concerned about the finer details of
              their festivities and can enjoy a night of beauty, festivity, and fun.
            </p>

            <p>
              Three-layered fondant cakes of your choosing, Tiffany chairs for your
              guests, and gorgeously decorated tables for cake, gifts, registration,
              and giveaways are just a few of the services we offer. Inquire with us
              to see our full amenities list today!
            </p>
          </div>

        </div>
      </section>

      <ServicesSlider 
        title="Debut Packages" 
        desc="Your debut is a once-in-a-lifetime transition into adulthood. We’ve designed these packages to provide a seamless foundation for your grand celebration, from intimate traditions to lavish festivities."
        services={debutServices} 
      />

      <ClientTestimonials />

      <LocationsSection />

      <PackageDetailsModal 
        isOpen={isModalOpen} 
        onClose={closePackageModal} 
        packageType={selectedPackage}
        onReserve={handleOpenReservation}
      />

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => {
            setIsReservationModalOpen(false);
            window.location.hash = '';
        }}
        onBack={handleBackToPackage}
        data={reservationData}
      />

    </div>
  );
}

export default DebutPage;