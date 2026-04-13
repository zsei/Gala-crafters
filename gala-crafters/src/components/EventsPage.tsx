import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BookingModal from './BookingModal';
import StyleSection from './StyleSection';
import LocationsSection from './LocationsSection';
import flower from '../assets/flower.jpg';
import green from '../assets/green.jpg';
import rw from '../assets/rw.jpg';
import rose from '../assets/rose.jpg';
import pw from '../assets/pw.jpg';

// Art Collection Images
import art1 from '../assets/art1.jpg';
import art2 from '../assets/art2.jpg';
import art3 from '../assets/art3.jpg';
import art4 from '../assets/art4.jpg';
import art5 from '../assets/art5.jpg';
import art6 from '../assets/art6.jpg';
import art7 from '../assets/art7.jpg';
import art8 from '../assets/art8.jpg';
import art9 from '../assets/art9.jpg';
import art10 from '../assets/art10.jpg';
import art11 from '../assets/art11.jpg';
import art12 from '../assets/art12.jpg';

const collections = [
  { id: 1, title: 'Art 1', subtitle: 'STYLE', img: art1 },
  { id: 2, title: 'Art 2', subtitle: 'STYLE', img: art2 },
  { id: 3, title: 'Art 3', subtitle: 'STYLE', img: art3 },
  { id: 4, title: 'Art 4', subtitle: 'STYLE', img: art4 },
  { id: 5, title: 'Art 5', subtitle: 'STYLE', img: art5 },
  { id: 6, title: 'Art 6', subtitle: 'STYLE', img: art6 },
  { id: 7, title: 'Art 7', subtitle: 'STYLE', img: art7 },
  { id: 8, title: 'Art 8', subtitle: 'STYLE', img: art8 },
  { id: 9, title: 'Art 9', subtitle: 'STYLE', img: art9 },
  { id: 10, title: 'Art 10', subtitle: 'STYLE', img: art10 },
  { id: 11, title: 'Art 11', subtitle: 'STYLE', img: art11 },
  { id: 12, title: 'Art 12', subtitle: 'STYLE', img: art12 },
  { id: 13, title: 'Flower', subtitle: 'STYLE', img: flower },
  { id: 14, title: 'Green', subtitle: 'STYLE', img: green },
  { id: 15, title: 'Rose', subtitle: 'STYLE', img: rose },
  { id: 16, title: 'PW', subtitle: 'STYLE', img: pw },
];

const sliderImages = [flower, green, rw];

function EventsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="events-page-wrapper">

      {/* 1. EVENTS HERO SECTION */}
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
            <span className="events-overline">EVENT STYLING GALLERY</span>
            <h2 className="events-main-title">
              <span className="italic-text">Crafter's</span> <br />
              <span className="gold-text">Artistry</span>
            </h2>
            <p>
              We take care of every detail so you can focus on making memories. From small gatherings to big celebrations, we make it happen.
            </p>
          </div>
        </div>
      </section>

      {/* CRAFTER'S COLLECTIONS SECTION */}
      <section className="services-section art-gallery-colored">
        <div className="container">
          <div className="services-intro" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#c49a2c', fontFamily: '"Playfair Display", serif', fontSize: '42px', fontWeight: 'bold', marginBottom: '10px' }}>
              The Art of Gala Crafters
            </h2>
            <div className="gold-line" style={{ margin: '0 auto 20px auto' }}></div>
            <p style={{ color: '#888', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '500' }}>
              FROM BIG WEDDINGS AND PRIVATE PARTIES, WE MAKE IT HAPPEN.
            </p>
          </div>

          <div className="services-grid">
            {collections.map((item, index) => (
              <motion.div
                key={item.id}
                className="service-item"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: (index % 4) * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="image-container" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                  <motion.img 
                    src={item.img} 
                    alt={item.title} 
                    style={{ transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)' }}
                    whileHover={{ scale: 1.1, filter: 'brightness(1.1)' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ADDITIONAL CATERING SERVICES (EXACT MATCH TO SCREENSHOT) */}
      <section className="custom-catering-section">
        <div className="custom-catering-container">

          {/* TOP ROW: Image on Left, Text on Right */}
          <div className="custom-catering-top">
            <div className="custom-catering-image">
              <img src={rw} alt="Catering Setup" />
            </div>
            <div className="custom-catering-text">
              <h2>Additional Catering Services at Gala Crafters</h2>
              <div className="gold-line" style={{ margin: '0 0 20px 0' }}></div>
              <p>At Gala Crafters, we explore beyond the ordinary with our bespoke offerings tailored to your unique needs. We believe that every event tells a story, and our mission is to ensure yours is narrated with elegance and precision. From intimate dinner parties to grand corporate galas, our dedicated team of culinary experts and event stylists work in harmony to create an atmosphere that resonates with your vision. Our commitment to excellence means we don't just provide services—we craft unforgettable experiences that leave a lasting impression on every guest.</p>
            </div>
          </div>

          {/* BOTTOM ROW: 3 Icons and Features */}
          <div className="custom-catering-features">

            {/* Feature 1: Food Tasting */}
            <div className="feature-box">
              <div className="feature-icon">
                {/* Hand and plate/spoon icon */}
                <svg viewBox="0 0 24 24" width="45" height="45" stroke="#ffffff" strokeWidth="1.2" fill="none">
                  <path d="M18 13v1a2 2 0 0 1-2 2H6L2 20v-2l3-3h11a2 2 0 0 0 2-2z" />
                  <path d="M8 9h8a2 2 0 0 1 2 2v2H6v-2a2 2 0 0 1 2-2z" />
                  <path d="M10 5v2" />
                  <path d="M14 5v2" />
                  <path d="M12 4v3" />
                </svg>
              </div>
              <h4>Food Tasting</h4>
              <p>Our food-tasting experience allows you to explore the full range of our culinary offerings, providing an opportunity to fine-tune and customize the menu based on your preferences.</p>
            </div>

            {/* Feature 2: Back Drop Styling */}
            <div className="feature-box">
              <div className="feature-icon">
                {/* Arch/Curtain icon */}
                <svg viewBox="0 0 24 24" width="45" height="45" stroke="#ffffff" strokeWidth="1.2" fill="none">
                  <path d="M4 22V8a8 8 0 0 1 16 0v14" />
                  <path d="M4 12c2.5 0 4 2 4 5v5" />
                  <path d="M20 12c-2.5 0-4 2-4 5v5" />
                  <path d="M2 22h20" />
                  <path d="M8 8a4 4 0 0 1 8 0" />
                </svg>
              </div>
              <h4>Back Drop Styling</h4>
              <p>You can transform your venue into a visually stunning masterpiece that complements your theme and enhances the overall ambiance. Our styling options range from elegant and classic designs to contemporary and themed setups.</p>
            </div>

            {/* Feature 3: Event Styling */}
            <div className="feature-box">
              <div className="feature-icon">
                {/* Gazebo/Tent icon */}
                <svg viewBox="0 0 24 24" width="45" height="45" stroke="#ffffff" strokeWidth="1.2" fill="none">
                  <path d="M12 2L2 10h20L12 2z" />
                  <path d="M4 10v12" />
                  <path d="M20 10v12" />
                  <path d="M8 10v12" />
                  <path d="M16 10v12" />
                  <path d="M2 22h20" />
                  <path d="M12 14c-1.5 1.5-1.5 3.5 0 5 1.5-1.5 1.5-3.5 0-5z" /> {/* Small center detail */}
                </svg>
              </div>
              <h4>Event Styling</h4>
              <p>From table settings to floral arrangements and overall venue decor, infuse your event with an extra layer of glamour through our event styling service.</p>
            </div>

          </div>
        </div>
      </section>

      <LocationsSection />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}

export default EventsPage;