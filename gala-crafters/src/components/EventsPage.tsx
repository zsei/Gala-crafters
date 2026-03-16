import React, { useState, useEffect } from 'react';
import BookingModal from './BookingModal';
import img1 from '../assets/img1.jpg'; 
import img2 from '../assets/img5.jpg';
import img3 from '../assets/img3.jpg'; 

const sliderImages = [img1, img2]; 

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
        </div>

        <div className="container events-content-wrapper">
          <div className="events-text-box">
            <span className="events-overline">EVENT STYLING</span>
            <h2>We bring stellar styling to deliver wonderful memories that last a lifetime</h2>
            <p>
              We understand the multifaceted nature of event planning, so aside from food catering you
              can put your trust in us to style your event the way you envision it!
            </p>
            <p>
              Our event stylists are driven by creativity and innovation to craft the perfect aesthetic that will
              wow your guests no matter the occasion!
            </p>
            <button className="events-btn">VIEW PHOTO GALLERY</button>
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

      {/* 2. LOCATIONS SECTION */}
      <section className="locations-section">
        <span className="locations-overline">LOCATIONS WE SERVE</span>
        <h2>The key cities we work in</h2>
        
        <div className="cities-list">
          <div className="city-row">
            <strong>METRO MANILA</strong> <span className="dot">•</span> Quezon City <span className="dot">•</span> Makati <span className="dot">•</span> Manila <span className="dot">•</span> San Juan <span className="dot">•</span> Taguig <span className="dot">•</span> Pasig
          </div>
          <div className="city-row">
            Marikina <span className="dot">•</span> Antipolo <span className="dot">•</span> Las Pinas <span className="dot">•</span> Alabang <span className="dot">•</span> Cainta <span className="dot">•</span> Tagaytay <span className="dot">•</span> Batangas
          </div>
        </div>
      </section>

     {/* 3. EVENT STYLING SHOWCASE SECTION */}
        <section className="styling-showcase-section container">
          
          <div className="styling-intro">
            {/* INILIPAT SA KALIWA (Yung Title at Subtitle) */}
            <div className="intro-right">
              <h2>Elevate your event</h2>
              <p className="subtitle">
                with captivating style, as we create a feast for the eyes that complements our delectable cuisine.
              </p>
            </div>

            {/* INILIPAT SA KANAN (Yung mahabang paragraph) */}
            <div className="intro-left">
              <p>
                Aside from delivering superior dishes and high quality foods, we also have 
                wide selections of styling with the help of our in-house partner styling team – 
                <strong> The Gala Crafters Styling Team.</strong>
              </p>
            </div>
          </div>

        {/* STYLE 1: 3-Column Compact Grid */}
        <div className="style-1-grid">
          <div className="grid-col">
            <img src={img1} alt="Styling Details" className="short-img" />
            <div className="style-label">
              <h3>Style 1</h3>
              <p>Help you choose the styling plan depends on your needs.</p>
            </div>
          </div>
          <div className="grid-col">
            <img src={img2} alt="Centerpiece Styling" className="tall-img" />
          </div>
          <div className="grid-col">
            <img src={img1} alt="Table Setup" className="short-img" />
          </div>
        </div>

        {/* STYLE 2: 2-Column Wide Grid */}
        <div className="style-2-grid">
          <div className="grid-col">
            <img src={img2} alt="Aisle Styling" className="tall-img" />
          </div>
          <div className="grid-col">
            <img src={img1} alt="Stage Styling" className="wide-img" />
            <div className="style-label horizontal">
              <h3>Style 2</h3>
              <p>Event Styling also important to your dream event. Be stylized by one of the best team we could offer you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ADDITIONAL CATERING SERVICES (EXACT MATCH TO SCREENSHOT) */}
      <section className="custom-catering-section">
        <div className="custom-catering-container">
          
          {/* TOP ROW: Image on Left, Text on Right */}
          <div className="custom-catering-top">
            <div className="custom-catering-image">
              {/* Gamitin ang tamang image variable mo dito (e.g., img3) */}
              <img src={img3} alt="Catering Setup" />
            </div>
            <div className="custom-catering-text">
              <h2>Additional Catering Services at Gala Crafters</h2>
              <p>At Gala Crafters, we explore beyond the ordinary with our bespoke offerings tailored to your unique needs.</p>
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

      {/* 5. THEMATIC STYLING SECTION */}
      <section className="thematic-styling-section">
        <div className="container">

          {/* Row 1: Customized Theme (Image Left, Text Right) */}
          <div className="theme-row">
            <div className="theme-image-wrapper style-tl-br">
              {/* Gamitin mo ang tamang image variable dito (e.g., img1) */}
              <img src={img1} alt="Customized Theme" />
            </div>
            <div className="theme-text">
              <h2>Customized Theme</h2>
              <div className="orange-divider"></div>
              <p>For any event, we believe that the styling should reflect the celebrants. To craft the perfect design for your event, we start by listening closely to your preferences and design aesthetics.</p>
              <p>Whether you need a full event design or just the basics, we map out a plan that is especially customized for you.</p>
              <p className="planning-question">What event are you planning?</p>
              
              <div className="theme-buttons">
                <button>Wedding</button>
                <button>Debut</button>
                <button>Corporate</button>
                <button>Others</button>
              </div>
            </div>
          </div>

          {/* Row 2: Thematic Styling (Text Left, Image Right) */}
          <div className="theme-row reverse">
            <div className="theme-image-wrapper style-tr-bl">
               {/* Gamitin mo ang tamang image variable dito (e.g., img2) */}
              <img src={img2} alt="Thematic Styling" />
            </div>
            <div className="theme-text">
              <h2>Thematic Styling</h2>
              <div className="orange-divider"></div>
              <p>Already have an event theme in mind? We got you!</p>
              <p>Our event stylists are flexible enough to cater whatever you have in mind—be it an 80's retro party or Great Gatsby, we'll capture it with the perfect food and design, keeping your goals and budget in mind!</p>
              <p className="planning-question">What event are you planning?</p>
              
              <div className="theme-buttons">
                <button>Wedding</button>
                <button>Debut</button>
                <button>Corporate</button>
                <button>Others</button>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* BOOKING BANNER */}
      <section className="corporate-banner-section">
        <div className="corporate-banner-container">
          <div className="corporate-img-left">
            <img src={img1} alt="Event Styling" />
          </div>
          <div className="corporate-banner-box">
            <h2>Elevate Your Styling With Gala Crafters!</h2>
            <p>
              Transform your event into a visual masterpiece with our bespoke styling services. Book your tasting and styling consultation today.
            </p>
            <button className="corporate-btn" onClick={() => setIsModalOpen(true)}>
              Book a Tasting Experience with Gala Crafters
            </button>
          </div>
          <div className="corporate-img-right">
            <img src={img2} alt="Event Styling" />
          </div>
        </div>
      </section>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
}

export default EventsPage;