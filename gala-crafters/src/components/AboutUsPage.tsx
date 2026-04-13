import React, { useState, useEffect } from 'react';
import art8 from '../assets/art8.jpg';
import art9 from '../assets/art9.jpg';
import art10 from '../assets/art10.jpg';

const sliderImages = [art8, art9, art10];

function AboutUsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
            <span className="events-overline">ABOUT US</span>
            <h2 className="events-main-title">
              <span className="italic-text">Gala</span> <br />
              <span className="gold-text">Crafters</span>
            </h2>
            <p>
              Gala Crafters was built for the host who wants to actually enjoy their own party. We saw that people often had to choose between great food and great design, so we decided to offer both. What started as a small catering project has grown into a premier event concierge, dedicated to making your milestone celebrations beautiful, delicious, and completely stress-free.            </p>
          </div>
        </div>

      </section>

      {/* 3. ENHANCED VISION SECTION */}
      <section
        className="enhanced-vm-section enhanced-vision"
        style={{ '--bg-img': `url(${art8})` } as React.CSSProperties}
      >
        <div className="enhanced-vm-container">
          <div className="enhanced-vm-card">
            <span className="enhanced-vm-overline">OUR VISION</span>
            <h2 className="enhanced-vm-title">
              Crafting<br />
              <span className="gold-italic">Unforgettable Events.</span>
            </h2>
            <p className="enhanced-vm-desc">
              We work to be the trusted partner behind your life’s most celebrated moments, making every detail seamless so you can be fully present.            </p>
            <div className="enhanced-vm-footer-link">
              EXPLORE OUR SERVICES <span style={{ fontSize: '14px' }}>&#8594;</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENHANCED MISSION SECTION */}
      <section
        className="enhanced-vm-section enhanced-mission"
        style={{ '--bg-img': `url(${art10})` } as React.CSSProperties}
      >
        <div className="enhanced-vm-container">
          <div className="enhanced-vm-card">
            <span className="enhanced-vm-overline">OUR MISSION</span>
            <h2 className="enhanced-vm-title">
              Dedicated to<br />
              <span className="gold-italic">Excellence.</span>
            </h2>
            <p className="enhanced-vm-desc">
              We believe every celebration deserves undivided attention. Our mission is to provide personalized service and high-quality catering that reflects your unique style and honors your guests.
            </p>
            <div className="enhanced-vm-footer-link">
              <span style={{ fontSize: '14px' }}>&#8592;</span> WORK WITH US
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOUNDER QUOTE SECTION */}
      <section className="founder-quote-section">
        <div className="quote-container">
          <div className="quote-icon">&#10078;</div>
          <h2 className="quote-text">
            "Elegance is not about being noticed, it’s about being remembered."          </h2>
          <div className="quote-author">
            &#8212; Giorgio Armani, Fashion Designer
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutUsPage;