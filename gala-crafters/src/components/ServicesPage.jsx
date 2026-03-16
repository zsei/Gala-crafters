import React, { useEffect, useState } from 'react';
import BookingModal from './BookingModal';
import img1 from '../assets/img1.jpg'; // Make sure you have these imports!
import img2 from '../assets/img5.jpg'; 
import img3 from '../assets/img3.jpg'; 

function ServicesPage() {
  // Scrolls to the top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="services-page-wrapper">

      {/* 1. WIDE HERO IMAGE */}
      <div className="srv-hero-banner">
        <img src={img3} alt="Catering Food Spread" />
      </div>

      {/* 2. PAGE INTRO TEXT */}
      <section className="srv-intro-section container">
        <h2>Elevate Your Occasion with Leading Catering<br/>Services in the Philippines</h2>
        <p>
          Elevate your events with Gala Crafters, the premier catering service in the Philippines. Our excellence is rooted in a meticulous process, from quality ingredients to culinary expertise. You are sure to experience the flavorful execution and the perfect marriage of food romance and catering artistry.
        </p>
        <p className="srv-tagline">Celebrate with Gala Crafters — where passion meets culinary mastery.</p>
      </section>

      {/* 3. SERVICES CARD GRID */}
      <section className="srv-cards-section container">
        <div className="srv-cards-grid">
          
          <div className="srv-card">
            <div className="srv-card-bg" style={{ backgroundImage: `url(${img3})` }}></div>
            <div className="srv-card-content">
              <h4>Weddings</h4>
              <p>With magnificent food offerings and unparalleled service, we craft a celebration that marks the union of two lives with unforgettable moments of love and joy.</p>
              <span className="srv-read-more">Read More &rarr;</span>
            </div>
          </div>

          <div className="srv-card">
            <div className="srv-card-bg" style={{ backgroundImage: `url(${img3})` }}></div>
            <div className="srv-card-content">
              <h4>Corporate Events</h4>
              <p>We transform ordinary corporate gatherings into extraordinary moments of collaboration and celebration with our best food selection and event services.</p>
              <span className="srv-read-more">Read More &rarr;</span>
            </div>
          </div>

          <div className="srv-card">
            <div className="srv-card-bg" style={{ backgroundImage: `url(${img3})` }}></div>
            <div className="srv-card-content">
              <h4>Debuts</h4>
              <p>Ensuring every moment is worthwhile, our catering and event styling approach caters to your every need, making your debut a cherished occasion filled with extraordinary experiences.</p>
              <span className="srv-read-more">Read More &rarr;</span>
            </div>
          </div>

          <div className="srv-card">
            <div className="srv-card-bg" style={{ backgroundImage: `url(${img3})` }}></div>
            <div className="srv-card-content">
              <h4>Children's Party</h4>
              <p>Transform your child's special day into an unforgettable adventure with our themed children's parties. From princesses to superheroes, we create magical moments they'll cherish forever.</p>
              <span className="srv-read-more">Read More &rarr;</span>
            </div>
          </div>

          <div className="srv-card">
            <div className="srv-card-bg" style={{ backgroundImage: `url(${img3})` }}></div>
            <div className="srv-card-content">
              <h4>Special Occasions</h4>
              <p>Celebrate life's most significant milestones in style with our bespoke special occasion packages. Whether it's a birthday, anniversary, or family reunion, let us help you make every moment extraordinary.</p>
              <span className="srv-read-more">Read More &rarr;</span>
            </div>
          </div>

          <div className="srv-card">
            <div className="srv-card-bg" style={{ backgroundImage: `url(${img3})` }}></div>
            <div className="srv-card-content">
              <h4>Event Styling</h4>
              <p>From thematic backdrops to personalized details, we tailor the ambiance of your event according to your preferences.</p>
              <span className="srv-read-more">Read More &rarr;</span>
            </div>
          </div>

          <div className="srv-card">
            <div className="srv-card-bg" style={{ backgroundImage: `url(${img3})` }}></div>
            <div className="srv-card-content">
              <h4>Catering Packages</h4>
              <p>Elevate your event with our customizable catering packages, meticulously crafted to suit your unique tastes and preferences. We offer a culinary experience that delights and impresses.</p>
              <span className="srv-read-more">Read More &rarr;</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CORE FEATURES SECTION */}
      <section className="core-features-section container">
        <div className="features-grid">
          
          <div className="feature-card">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="#9e1b22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6"></circle>
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
              <path d="M9 8h6"></path>
              <path d="M12 5v6"></path>
            </svg>
            <h3>Expertise and Experience</h3>
            <p>
              From menu planning to execution, our seasoned team is well-versed in handling diverse events, ensuring a 
              smooth and memorable experience for you and your guests. Our expertise extends to logistics and safety 
              standards, adeptly handling unexpected challenges.
            </p>
          </div>

          <div className="feature-card">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="#9e1b22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              <path d="M8 7h6"></path>
              <path d="M8 11h8"></path>
            </svg>
            <h3>Wide Menu Options</h3>
            <p>
              Whether you're hosting a formal dinner, a casual gathering, or a themed event, we can 
              tailor menus to suit your specific requirements. We offer a diverse range of menu options, accommodating various 
              tastes and preferences.
            </p>
          </div>

          <div className="feature-card">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="#9e1b22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 2-6 3-3 6-3 10h16l-3-10-3-6z"></path>
              <path d="M2 22h20"></path>
              <path d="M8 12l4-4"></path>
            </svg>
            <h3>Customization and Flexibility</h3>
            <p>
              We understand that every event is different, and we are willing to work closely with you to tailor our services 
              accordingly. From dietary restrictions to specific cultural preferences, we can accommodate a variety of requests, 
              ensuring that they align with your vision for the event.
            </p>
          </div>

        </div>
      </section>
      
     {/* 5. DETAILED SERVICES ZIG-ZAG SECTION */}
      <section className="detailed-services-section">
        <div className="container"> {/* Added container INSIDE the section */}
          
          <div className="detailed-services-intro">
            <h2>Our Catering Services at Gala Crafters</h2>
            <p>
              Here at Gala Crafters, we excel in planning diverse events and catering to various tastes. 
              Whether you desire traditional Filipino, European, tapas, fusion, or custom buffet stations, 
              we have you covered. Explore our catering services below.
            </p>
          </div>

          <div className="service-row">
            <div className="service-text">
              <h3>Wedding Catering</h3>
              <p>
                Make your wedding reception stress-free and memorable with our catering services. 
                We carefully consider factors like your theme and guests' preferences to create the perfect menu.
              </p>
            </div>
            <div className="service-image">
              <img src={img1} alt="Wedding Catering" />
            </div>
          </div>

          <div className="service-row reverse">
            <div className="service-text">
              <h3>Corporate Catering</h3>
              <p>
                Whether it's a high-profile business meeting, a product launch, or a corporate gala, 
                our catering services in the Philippines add a touch of sophistication to your professional gatherings.
              </p>
            </div>
            <div className="service-image">
              <img src={img2} alt="Corporate Catering" />
            </div>
          </div>

          <div className="service-row">
            <div className="service-text">
              <h3>Debut Catering</h3>
              <p>
                For your debut, we ensure perfection at every step, creating memorable and magical events. 
                Our attention to detail and quality have attracted high-profile clientele, showcasing our 
                ability to make every debut truly special.
              </p>
            </div>
            <div className="service-image">
              <img src={img3} alt="Debut Catering" />
            </div>
          </div>

          <div className="service-row reverse">
            <div className="service-text">
              <h3>Children's Party Catering</h3>
              <p>
                We specialize in the best children's party designs, crafting menus with care. Collaborate 
                with us, and even involve your child in theme customization. Our attention to clientele 
                includes facilitating parties for esteemed families.
              </p>
            </div>
            <div className="service-image">
              <img src={img1} alt="Children's Party Catering" />
            </div>
          </div>

          <div className="service-row">
            <div className="service-text">
              <h3>Special Occasions Catering</h3>
              <p>
                Life is punctuated by special moments, and our food services extend to embrace the richness 
                of these occasions through tailored menus and impeccable service. Whether it's a milestone 
                anniversary or a family reunion, our special occasions catering ensures that the culinary 
                experience becomes an integral part of your celebrations.
              </p>
            </div>
            <div className="service-image">
              <img src={img2} alt="Special Occasions Catering" />
            </div>
          </div>

        </div> {/* Closes the container */}
      </section>

      {/* 6. OUR PROCESS SECTION */}
      <section className="process-section">
        <div className="container">
          
          <div className="process-header">
            <span className="process-overline">OUR PROCESS</span>
            <h2>The perfect celebration is<br/>as easy as 1, 2, 3</h2>
          </div>

          <div className="process-grid">
            
            <div className="process-card">
              <div className="process-number">
                <span className="line"></span>
                <span className="num">1</span>
                <span className="line"></span>
              </div>
              <h4>TELL US ABOUT YOUR EVENT</h4>
              <p>
                Share with us your vision—party inspirations, food preferences,
                target date, approximate guest count, budget, theme ideas and venue.
              </p>
              <p>
                Together, we will plan an exceptional celebration for your special day.
              </p>
            </div>

            <div className="process-card">
              <div className="process-number">
                <span className="line"></span>
                <span className="num">2</span>
                <span className="line"></span>
              </div>
              <h4>CHOOSE YOUR PACKAGE +<br/>DO FOOD TASTING</h4>
              <p>
                Look through our menu packages and we will adjust and fine-tune
                depending on your preferences and budget while still ensuring you
                the best quality.
              </p>
              <p>
                Afterward, you can schedule a food tasting to make sure that
                everything is prepared and flavored to your exact liking.
              </p>
            </div>

            <div className="process-card">
              <div className="process-number">
                <span className="line"></span>
                <span className="num">3</span>
                <span className="line"></span>
              </div>
              <h4>ENJOY THE PERFECT EVENT</h4>
              <p className="process-bold-text">We have it from here!</p>
              <p>
                Take a deep breath and relax as we serve you and your guests an
                outstanding event and food experience.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BUTTON */}
      <div className="srv-bottom-cta" style={{ backgroundColor: '#FFF6EF', paddingTop: '40px', paddingBottom: '100px', textAlign: 'center' }}>
        <button className="srv-book-btn" onClick={() => setIsModalOpen(true)}>Book a Tasting Experience with Gala Crafters</button>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
}

export default ServicesPage;