import React from 'react';
import MenuSlider from './MenuSlider';
import img1 from '../assets/glamour-2.jpg';
import img2 from '../assets/glamour-3.jpg';
import img3 from '../assets/glamour-4.jpg';
import img4 from '../assets/img5.jpg';

// Gold SVG Icons
const IconPalette = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2C10.06 2 2 10.06 2 20C2 29.94 10.06 38 20 38C22.25 38 24 36.25 24 34C24 33 23.6 32.1 23 31.4C22.4 30.7 22 29.8 22 28.8C22 26.6 23.8 24.8 26 24.8H31C34.8 24.8 38 21.6 38 17.8C38 9.06 29.94 2 20 2ZM10 20C8.9 20 8 19.1 8 18C8 16.9 8.9 16 10 16C11.1 16 12 16.9 12 18C12 19.1 11.1 20 10 20ZM16 12C14.9 12 14 11.1 14 10C14 8.9 14.9 8 16 8C17.1 8 18 8.9 18 10C18 11.1 17.1 12 16 12ZM24 12C22.9 12 22 11.1 22 10C22 8.9 22.9 8 24 8C25.1 8 26 8.9 26 10C26 11.1 25.1 12 24 12ZM30 20C28.9 20 28 19.1 28 18C28 16.9 28.9 16 30 16C31.1 16 32 16.9 32 18C32 19.1 31.1 20 30 20Z" fill="#c49a2c" />
  </svg>
);

const IconSparkle = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0L24.7 15.3L40 20L24.7 24.7L20 40L15.3 24.7L0 20L15.3 15.3L20 0Z" fill="#c49a2c" />
  </svg>
);

const IconShield = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2.6L36 8V20C36 30.6 28.2 38.6 20 40C11.8 38.6 4 30.6 4 20V8L20 2.6ZM12 20C12 23.9 15.6 28 20 30C24.4 28 28 23.9 28 20C28 16.1 24.4 12 20 10C15.6 12 12 16.1 12 20Z" fill="#c49a2c" />
  </svg>
);

const collections = [
  { id: 1, title: 'Weddings', subtitle: 'ENCHANTED UNIONS', img: img1 },
  { id: 2, title: 'Corporate Galas', subtitle: 'PRESTIGE & INFLUENCE', img: img2 },
  { id: 3, title: 'Private Soirees', subtitle: 'INTIMATE ELEGANCE', img: img3 },
  { id: 4, title: 'Exhibitions', subtitle: 'CULTURAL CURATION', img: img4 },
];

function Services() {
  return (
    <>
      {/* SECTION 1: PHOTO GALLERY (White Background) */}
      <section className="services-section">
        <div className="container">
          <div className="services-intro">
            <h2>Curated Collections</h2>
            <div className="gold-line"></div>
            <p>BESPOKE EXPERIENCES FOR LIFE'S MOST SIGNIFICANT MILESTONES</p>
          </div>

          <div className="services-grid">
            {/* FIXED: Now mapping through the collections correctly */}
            {collections.map((item) => (
              <div key={item.id} className="service-item">
                <div className="image-container">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="service-info">
                  <h4>{item.title}</h4>
                  <span>{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: MENU SLIDER */}
      <MenuSlider />

      {/* SECTION 2: CURATED EXCELLENCE (Gray Background) */}
      <section className="excellence-section">
        <div className="container">
          <div className="excellence-header">
            <div className="excellence-titles">
              <h2>CURATED EXCELLENCE</h2>
              <p className="subtitle">CRAFTING THE UNFORGETTABLE WITH PRECISION AND GOLD-STANDARD AESTHETICS.</p>
            </div>
            <div className="all-services-link">ALL SERVICES</div>
          </div>

          <div className="excellence-grid">
            <div className="excellence-card">
              <div className="icon-wrapper"><IconPalette /></div>
              <h4><span>BESPOKE DESIGN</span></h4>
              <p>Our signature aesthetic blends contemporary minimalism with the timeless warmth of gold, creating a visual language that speaks of luxury.</p>
            </div>
            <div className="excellence-card">
              <div className="icon-wrapper"><IconSparkle /></div>
              <h4><span>GOLD STANDARD</span></h4>
              <p>Uncompromising attention to detail for our elite clientele, ensuring every touchpoint reflects the highest tier of service excellence.</p>
            </div>
            <div className="excellence-card">
              <div className="icon-wrapper"><IconShield /></div>
              <h4><span>WHITE-GLOVE</span></h4>
              <p>Seamless coordination from the first concept sketch to the final curtain call, handled with the utmost discretion and care.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;