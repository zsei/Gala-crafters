import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ServicesSlider from './ServicesSlider';
import ClientTestimonials from './ClientTestimonials';
import LocationsSection from './LocationsSection';
import PackageDetailsModal from './PackageDetailsModal';
import ReservationModal from './ReservationModal';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

// Assets
import img2b from '../assets/img2b.jpg';
import img2a from '../assets/img2a.jpg';
import ww from '../assets/ww.jpg';
import sea from '../assets/sea.jpg';
import wed1 from '../assets/wed1.jpg';
import glamour2 from '../assets/glamour-2.jpg';
import bt from '../assets/bt.jpg';
import art2 from '../assets/art2.jpg';
import kiss from '../assets/kiss.jpg';
import img11 from '../assets/img11.jpg';
import wed2 from '../assets/wed2.jpg';
import wedblue from '../assets/wedblue.jpg';
import { FaGift, FaRegHeart, FaCheckSquare } from "react-icons/fa";

const sliderImages = [img2b, img2a, ww, sea];
const weddingGalleryImages = [wed1, glamour2, bt, art2, kiss, img11, wed2, wedblue];
function WeddingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'intimate' | 'utopian' | 'elite'>('intimate');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackageData, setSelectedPackageData] = useState<any>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PACKAGES.LIST}`);
        if (response.ok) {
          const data = await response.json();
          // Filter for wedding packages only
          const weddingPkgs = data.filter((p: any) => p.event_type.toLowerCase() === 'wedding');
          setPackages(weddingPkgs);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const openPackageModal = (type: 'intimate' | 'utopian' | 'elite') => {
    setSelectedPackage(type);
    
    // Find the actual data for this package from the fetched list
    if (packages.length > 0) {
      const pkgNameMap: any = {
        'intimate': 'Intimate Wedding Package',
        'utopian': 'Utopian Wedding Package',
        'elite': 'Elite Wedding Package'
      };
      const targetName = pkgNameMap[type];
      const found = packages.find(p => p.package_name === targetName);
      if (found) {
        // Map backend fields to frontend format if needed
        const mapped = {
          ...found,
          title: found.package_name,
          basePrice: found.base_price,
          included: found.included_items ? (function() {
            try {
              const parsed = JSON.parse(found.included_items);
              return Array.isArray(parsed) ? parsed : [];
            } catch(e) { return []; }
          })() : []
        };
        setSelectedPackageData(mapped);
      } else {
        setSelectedPackageData(null);
      }
    }
    
    setIsModalOpen(true);
  };

  const closePackageModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenReservation = (data: any) => {
    setReservationData(data);
    setIsModalOpen(false); // Close the first modal
    setIsReservationModalOpen(true); // Open the reservation modal
  };

  const handleBackToPackage = () => {
    setIsReservationModalOpen(false);
    setIsModalOpen(true);
  };

  const weddingServices = [
    {
      title: "Intimate",
      desc: "Designed for smaller celebrations with those who matter most. We focus on the personal touches that make a close-knit wedding feel truly special and unforgettable.",
      link: "#",
      bg: img2a,
      onClick: () => openPackageModal('intimate')
    },
    {
      title: "Utopian",
      desc: "Our signature choice for couples who want a beautiful balance of elegance and detail. We handle the heavy lifting so you can enjoy a polished, stress-free celebration.",
      link: "#",
      bg: ww,
      onClick: () => openPackageModal('utopian')
    },
    {
      title: "Elite",
      desc: "Our most comprehensive experience. This is for the couple who wants every detail handled—from premium styling to full-scale coordination—for a truly grand celebration.",
      link: "#",
      bg: sea,
      onClick: () => openPackageModal('elite')
    }
  ];

  return (
    <div className="debut-page-wrapper" style={{ backgroundColor: '#ffffff', paddingBottom: '0px' }}>

      {/* 1. WEDDING HERO SECTION (SLIDER OVERLAY) */}
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
            <span className="events-overline">WEDDING CATERING & SERVICES</span>
            <h2 className="events-main-title">
              <span className="italic-text">Timeless</span> <br />
              <span className="gold-text">Elegance</span>
            </h2>
            <p>
              Your wedding day is a once-in-a-lifetime union. We take care of every detail so you can focus on making beautiful memories.
            </p>
          </div>
        </div>
      </section>

      {/* 2. GALLERY SECTION (WITH FULL TEXT RESTORED) */}
      <section className="debut-gallery-section" style={{ padding: '80px 0' }}>
        <div className="debut-gallery-header">
          <h2 style={{ color: '#c49a2c', fontWeight: 'bold' }}>Crafter's Wedding Services</h2>
          <div className="gold-line" style={{ margin: '15px auto 25px auto' }}></div>
          <p>
            Your wedding day is a once-in-a-lifetime union, a cherished occasion that marks the beautiful beginning of your journey together. It's undoubtedly one of the most important moments of your life, and with Gala Crafters at your side, you're sure to want for nothing during the affair. Our service's bespoke approach is sure to cater to every need, making every moment a worthwhile one.
          </p>
        </div>
        <div style={{ padding: '0 5%', maxWidth: '1600px', margin: '0 auto' }}>
          <div className="services-grid">
            {weddingGalleryImages.map((image, index) => (
              <motion.div 
                key={index}
                className="service-item"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.15 }}
              >
                <div className="image-container">
                   <img src={image} alt={`Wedding Layout ${index + 1}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SHOULD YOU HIRE SECTION */}
      <section className="wedding-hire-section">

        {/* FIRST ROW */}
        <div className="wedding-hire-row">

          <div className="wedding-hire-image">
            <img src={img2a} alt="Wedding Ceremony" />
          </div>

          <div className="wedding-hire-text">
            <h2>Why Should You Hire a Wedding Catering Service</h2>
            <div className="gold-line" style={{ margin: '15px 0 30px 0' }}></div>

            <p>
              The most important part of the wedding is the reception itself. This is
              the part of the event in which the union of a loving couple will finally
              be completed, with the company of their family and guests watching
              happily. A wedding reception is always a beautiful sight to behold,
              with elaborate and elegant decorations, colorful flowers, well-dressed
              family and guests, and a picturesque and peaceful venue.
            </p>

            <p>
              One of the most anticipated parts of any wedding (after the “I do’s,” of
              course) is the food. You may be in doubt about hiring a caterer,
              thinking that you can rely on yourself, your friends, and your family
              to prepare the food. In the old days, the family would get the women
              and start cooking for the feast two to three days before the wedding.
              Just imagine, a kitchen full of charming old and young ladies of both
              families cooking up a storm for your special day. While this may have
              been quite a sight during those days, it simply isn’t something that is
              feasible nowadays.
            </p>
          </div>

        </div>

        {/* SECOND ROW */}
        <div className="wedding-hire-row reverse">

          <div className="wedding-hire-image">
            <img src={ww} alt="Wedding Signing" />
          </div>

          <div className="wedding-hire-text">
            <h2>Why you should book Gala Crafters Wedding Package</h2>
            <div className="gold-line" style={{ margin: '15px 0 30px 0' }}></div>

            <p>
              Today, this simply isn’t a practical thing to do; people are busier now
              than ever. Most weddings have a large number of guests, which means
              that the time to prepare the food would have to be shorter. You would
              also be required to buy all the ingredients you need to create each
              dish, which will already cost you a lot of money (without even counting
              the price of the event venue and the decorations).
            </p>

            <p>
              The best way to save time and effort while making sure the food will be
              excellent is by hiring a good Philippine wedding catering service
              provider.
            </p>

          </div>

        </div>

      </section>

      <ServicesSlider 
        title="Wedding Packages" 
        desc="Whether you're planning a quiet, meaningful gathering or a grand celebration, we’ve designed these packages to provide a seamless foundation for your big day. Choose the level of service that best fits your vision."
        services={weddingServices} 
      />

      <ClientTestimonials />

      <LocationsSection />

      <PackageDetailsModal 
        isOpen={isModalOpen} 
        onClose={closePackageModal} 
        packageType={selectedPackage}
        onReserve={handleOpenReservation}
        packageData={selectedPackageData}
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

export default WeddingPage;