import React, { useState, useEffect } from 'react';
import img1 from '../assets/img1.jpg'; 
import img2 from '../assets/img5.jpg';
import img3 from '../assets/img3.jpg';

const sliderImages = [img1, img2]; 

function AboutUsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
        </div>

        <div className="container events-content-wrapper">
          <div className="events-text-box">
            <span className="events-overline">ABOUT US</span>
            <h2>Gala Crafters</h2>
            <p>
              We understand the multifaceted nature of event planning, so aside from food catering you
              can put your trust in us to style your event the way you envision it!
            </p>
          </div>
        </div>

        {/* THE WAVE DIVIDER */}
        <div className="wave-bottom">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path 
              fill="#ffffff" 
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* 2. LEGACY OF GRANDEUR SECTION */}
      <section className="legacy-section container">
        <div className="legacy-content">
          
          {/* TEXT SIDE */}
          <div className="legacy-text-side">
            <span className="legacy-overline">THE HERITAGE</span>
            <h2>A Legacy of Grandeur</h2>
            
            <p>
              Founded in the pursuit of perfection, Gala Crafters began as a boutique studio catering to European aristocracy. Today, our footprint is global, but our ethos remains intimate.
            </p>
            <p>
              Every occasion is treated as a masterpiece. From historic estates in Tuscany to modern penthouses in New York, we weave the narrative of our clients into every floral arrangement, every lighting cue, and every curated guest experience.
            </p>
            
            <div className="legacy-divider"></div>
            
            {/* STATS */}
            <div className="legacy-stats">
              <div className="stat-box">
                <span className="stat-number">15+</span>
                <span className="stat-label">YEARS OF EXCELLENCE</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">400+</span>
                <span className="stat-label">GLOBAL GALAS</span>
              </div>
            </div>
            
          </div>

          {/* ASYMMETRICAL IMAGE GALLERY SIDE */}
          <div className="legacy-gallery-side">
            
            {/* COLUMN 1 */}
            <div className="gallery-col col-1">
              <div className="gallery-img-box img-top-left">
                 <img src={img1} alt="Elegant Table Setting" />
              </div>
              <div className="gallery-img-box img-bottom-left">
                 {/* Replace with a fourth variable if you have one, using img2 for now */}
                 <img src={img2} alt="Evening Event Setup" />
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="gallery-col col-2">
               <div className="gallery-img-box img-top-right">
                  <img src={img3} alt="Gold Cake Design" />
               </div>
               <div className="gallery-img-box img-bottom-right">
                  <img src={img2} alt="Champagne Glasses" />
               </div>
            </div>

          </div>
          
        </div>
      </section>

    </div>
  );
}

export default AboutUsPage;