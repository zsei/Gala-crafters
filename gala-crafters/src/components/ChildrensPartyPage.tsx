import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ServicesSlider, { ServiceItem } from './ServicesSlider';
import ClientTestimonials from './ClientTestimonials';
import LocationsSection from './LocationsSection';
import PackageDetailsModal from './PackageDetailsModal';
import ReservationModal from './ReservationModal';

// Assets
import heroBg from '../assets/pink.jpg'; 
import img1 from '../assets/blue.jpg'; 
import img2 from '../assets/img5.jpg'; 
import img3 from '../assets/img1a.jpg'; 
import img4 from '../assets/DSC9849.jpg';
import { FaBirthdayCake, FaStar } from "react-icons/fa";

const sliderImages = [heroBg, img1, img2, img3];
const partyGalleryImages = [heroBg, img1, img2, img3, img4, heroBg, img1, img2];

function ChildrensPartyPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'kiddiePlayful' | 'kiddieAdventure' | 'kiddieCarnival'>('kiddiePlayful');
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

  const openPackageModal = (type: 'kiddiePlayful' | 'kiddieAdventure' | 'kiddieCarnival') => {
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

  const kiddieServices: ServiceItem[] = [
    {
      title: "The Playful Set",
      desc: "Our delightful starter package for a fun-filled birthday! Featuring kid-friendly favorites, colorful styling, and our cheerful service team.",
      link: "#",
      bg: heroBg,
      onClick: () => openPackageModal('kiddiePlayful')
    },
    {
      title: "The Adventure Set",
      desc: "An action-packed celebration featuring customized dining stations, a custom pasta station, and grand thematic character styling.",
      link: "#",
      bg: img1,
      onClick: () => openPackageModal('kiddieAdventure')
    },
    {
      title: "The Carnival Set",
      desc: "The ultimate grand celebration featuring a grand entrance arch, dessert extravaganza, and full-scale party lighting.",
      link: "#",
      bg: img2,
      onClick: () => openPackageModal('kiddieCarnival')
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
          <div className="events-overlay" style={{ background: 'rgba(0, 0, 0, 0.4)' }}></div>

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
            <span className="events-overline">CHILDREN'S PARTY SERVICES</span>
            <h2 className="events-main-title">
              <span className="italic-text">Magical</span> <br />
              <span className="gold-text">Celebrations</span>
            </h2>
            <p>
              Make your child's dream party a reality. From whimsical themes to engaging activities and kid-friendly menus, we craft unforgettable moments for your little ones and their friends.
            </p>
          </div>
        </div>
      </section>

      {/* 2. GALLERY SECTION */}
      <section className="debut-gallery-section" style={{ padding: '80px 0' }}>
        <div className="debut-gallery-header" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '42px', color: '#c49a2c', marginBottom: '15px', fontWeight: 'bold' }}>Gala Crafters Kids' Party Services</h2>
          <div className="gold-line" style={{ margin: '15px auto 25px auto' }}></div>
          <p>
            A child's birthday is a milestone full of wonder and joy. At Gala Crafters, we specialize in bringing magical concepts to life. Whether it’s an enchanted princess ball, a superhero adventure, or a colorful carnival, our bespoke designs and dedicated planning ensure an atmosphere full of laughter, fun, and picture-perfect memories.
          </p>
        </div>
        <div style={{ padding: '0 5%', maxWidth: '1600px', margin: '0 auto' }}>
          <div className="services-grid">
            {partyGalleryImages.map((image, index) => (
              <motion.div 
                key={index}
                className="service-item"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.15 }}
              >
                <div className="image-container">
                  <img src={image} alt={`Kids Party Layout ${index + 1}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="debut-experience-section">
        <div className="debut-experience-container">

          <div className="debut-experience-text">
            <h2>The Magical Experience</h2>
            <div className="gold-line" style={{ margin: '0 0 20px 0' }}></div>

            <p>
              From custom-themed decorations and colorful dessert buffets to exciting entertainment and play areas, we curate everything to capture your child's imagination. Gala Crafters provides full-service solutions specifically tailored for children’s parties:
            </p>
          </div>

          <div className="debut-experience-image">
            <img src={heroBg} alt="Children's Party" />
          </div>

        </div>

        <div className="container debut-traditions-grid">

          <div className="tradition-card">
            <FaBirthdayCake className="tradition-icon" />
            <h3>Themed Catering & Cakes</h3>
            <p>
              Delight both kids and adults with our thoughtfully planned menus. We offer fun, bite-sized kid favorites alongside elegant adult dishes, topped off with a spectacular customized birthday cake that perfectly matches your chosen theme.
            </p>
          </div>

          <div className="tradition-card">
            <FaStar className="tradition-icon" />
            <h3>Creative Venues & Styling</h3>
            <p>
              Our expert stylists transform any space into a vibrant playground. With playful backdrops, balloon installations, and thematic table settings, we ensure every corner sparks joy and creates a fantastic backdrop for photos.
            </p>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="why-choose-section">
        <div className="why-choose-container">

          <div className="why-choose-image">
            <img src={img1} alt="Kids Event Setting" />
          </div>

          <div className="why-choose-content">
            <h2>Why Choose Gala Crafters for Your Kids' Parties</h2>
            <div className="gold-line" style={{ margin: '0 0 20px 0' }}></div>

            <p>
              Planning a children's party requires boundless creativity and a keen eye for detail. Our team works hand-in-hand with parents to ensure every aspect—from the games to the giveaways—is tailored to the birthday celebrant's unique personality and interests. We take the stress out of planning so you can fully enjoy the festivities with your child.
            </p>

            <p>
              We partner with trusted entertainers, face painters, and activity hosts to keep the little ones engaged. Inquire with us today to start planning a spectacular, stress-free celebration your child will cherish forever!
            </p>
          </div>

        </div>
      </section>

      <ServicesSlider 
        title="Children's Party Packages" 
        desc="Choose from our expertly themed party sets designed to spark joy and create magical memories for your little ones."
        services={kiddieServices}
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

export default ChildrensPartyPage;
