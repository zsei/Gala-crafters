import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookingModal from './BookingModal';
import sigPlatedImg from '../assets/sigplated.png';
import internationalImg from '../assets/international.png';
import karekareImg from '../assets/karekare.png';
import kidsMenuImg from '../assets/kidsmenu.png';
import img2a from '../assets/img2a.jpg';
import img1q from '../assets/1q.jpg';
import vintageGold from '../assets/Vintage-Gold.jpg';
import banner2 from '../assets/banner-2.jpg';
import whitegold from '../assets/whitegold.jpg';
import slider1 from '../assets/banner-7.jpg';
import slider2 from '../assets/img1a.jpg';
import slider3 from '../assets/DSC9804.jpg';
import slider4 from '../assets/glamour-2.jpg';

const sliderImages = [vintageGold, banner2, whitegold];

function ServicesPage() {
  // Scrolls to the top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="services-page-wrapper">

      {/* 1. SERVICES HERO SECTION (DYNAMIC SLIDER OVERLAY) */}
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
          <div className="events-text-box" style={{ maxWidth: '850px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="events-overline" style={{ marginBottom: '20px', color: '#ffffff' }}>ALL OUR SERVICES</span>
            <h2 className="events-main-title" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <span className="italic-text">Crafter's</span> <br />
              <span className="gold-text">Services</span>
            </h2>
            <p style={{ maxWidth: '750px', textAlign: 'left', marginBottom: '20px' }}>
              Elevate your events with Gala Crafters, the premier catering service in the Philippines. Our excellence is rooted in a meticulous process, from quality ingredients to culinary expertise. You are sure to experience the flavorful execution and the perfect marriage of food romance and catering artistry.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SERVICES CARD GRID */}
      <section className="srv-cards-section container" style={{ paddingTop: '100px' }}>
        <div className="services-intro">
          <h2 style={{ color: '#c49a2c' }}>Gala Crafter's Services</h2>
          <div className="gold-line"></div>
          <p style={{ fontSize: '12px', letterSpacing: '3px', color: '#888', textTransform: 'uppercase' }}>FROM BIG WEDDINGS AND PRIVATE PARTIES, WE MAKE IT HAPPEN.</p>
        </div>
        {/* Row 1: 3 cards */}
        <div className="srv-cards-grid">

          <Link to="/services/weddings" className="srv-card-link">
            <div className="srv-card">
              <div className="srv-card-bg" style={{ backgroundImage: `url(${slider4})` }}></div>
              <div className="srv-card-content">
                <h4 style={{ color: '#c49a2c', fontFamily: "'Playfair Display', serif" }}>Weddings</h4>
                <div style={{ width: '40px', height: '2px', background: '#c49a2c', marginBottom: '12px' }}></div>
                <p>With magnificent food offerings and unparalleled service, we craft a celebration that marks the union of two lives with unforgettable moments of love and joy.</p>
                <span className="srv-read-more">Read More &rarr;</span>
              </div>
            </div>
          </Link>

          <Link to="/corporate" className="srv-card-link">
            <div className="srv-card">
              <div className="srv-card-bg" style={{ backgroundImage: `url(${slider1})` }}></div>
              <div className="srv-card-content">
                <h4 style={{ color: '#c49a2c', fontFamily: "'Playfair Display', serif" }}>Corporate Events</h4>
                <div style={{ width: '40px', height: '2px', background: '#c49a2c', marginBottom: '12px' }}></div>
                <p>We transform ordinary corporate gatherings into extraordinary moments of collaboration and celebration with our best food selection and event services.</p>
                <span className="srv-read-more">Read More &rarr;</span>
              </div>
            </div>
          </Link>

          <Link to="/debut" className="srv-card-link">
            <div className="srv-card">
              <div className="srv-card-bg" style={{ backgroundImage: `url(${slider2})` }}></div>
              <div className="srv-card-content">
                <h4 style={{ color: '#c49a2c', fontFamily: "'Playfair Display', serif" }}>Debuts</h4>
                <div style={{ width: '40px', height: '2px', background: '#c49a2c', marginBottom: '12px' }}></div>
                <p>Ensuring every moment is worthwhile, our catering and event styling approach caters to your every need, making your debut a cherished occasion filled with extraordinary experiences.</p>
                <span className="srv-read-more">Read More &rarr;</span>
              </div>
            </div>
          </Link>

        </div>

        {/* Row 2: 2 cards centered */}
        <div className="srv-cards-grid srv-cards-grid-bottom">

          <Link to="/services/childrens-party" className="srv-card-link">
            <div className="srv-card">
              <div className="srv-card-bg" style={{ backgroundImage: `url(${slider3})` }}></div>
              <div className="srv-card-content">
                <h4 style={{ color: '#c49a2c', fontFamily: "'Playfair Display', serif" }}>Children's Party</h4>
                <div style={{ width: '40px', height: '2px', background: '#c49a2c', marginBottom: '12px' }}></div>
                <p>Transform your child's special day into an unforgettable adventure with our themed children's parties. From princesses to superheroes, we create magical moments they'll cherish forever.</p>
                <span className="srv-read-more">Read More &rarr;</span>
              </div>
            </div>
          </Link>

          <Link to="/services/special-occasions" className="srv-card-link">
            <div className="srv-card">
              <div className="srv-card-bg" style={{ backgroundImage: `url(${slider1})` }}></div>
              <div className="srv-card-content">
                <h4 style={{ color: '#c49a2c', fontFamily: "'Playfair Display', serif" }}>Special Occasions</h4>
                <div style={{ width: '40px', height: '2px', background: '#c49a2c', marginBottom: '12px' }}></div>
                <p>Celebrate life's most significant milestones in style with our bespoke special occasion packages. Whether it's a birthday, anniversary, or family reunion, let us help you make every moment extraordinary.</p>
                <span className="srv-read-more">Read More &rarr;</span>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 3.5 DEBUT EXPERIENCE SECTION */}
      <section className="debut-experience-section" style={{ padding: '0' }}>
        <div className="menu-slider-container" style={{ gridTemplateColumns: 'max(40px, calc((100% - 1500px) / 2 + 40px)) 400px 80px minmax(0, 1fr)', padding: '0' }}>
          <div className="menu-slider-info" style={{ gridColumn: '2', padding: '120px 0' }}>
            <h2 style={{ fontSize: '42px', marginBottom: '30px' }}>The Gala Crafter Experience</h2>
            <div className="gold-line" style={{ margin: '0 0 20px 0' }}></div>
            <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.8' }}>
              We understand that your event is more than just a gathering; it’s a milestone worth celebrating perfectly. Our team takes a comprehensive approach to event planning, moving beyond traditional catering to offer a complete styling and management experience. We work closely with you to curate menus, design stunning venues, and oversee the logistics of the day, making sure your vision comes to life exactly as you imagined.
            </p>
          </div>
          <div className="debut-experience-image" style={{ gridColumn: '4', height: '100%' }}>
            <img src={img2a} alt="Debut Event Setup" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES SECTION */}
      <section className="core-features-section container">
        <div className="features-grid">

          <div className="feature-card">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="#c49a2c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="#c49a2c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="#c49a2c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
            <div className="gold-line" style={{ margin: '0 auto 40px' }}></div>
            <p>
              Here at Gala Crafters, we excel in planning diverse events and catering to various tastes.
              Whether you desire traditional Filipino, European, tapas, fusion, or custom buffet stations,
              we have you covered. Explore our catering services below.
            </p>
          </div>

          <div className="service-row">
            <div className="service-text">
              <h3>Chef's Special</h3>
              <div style={{ width: '40px', height: '2px', background: '#c49a2c', marginBottom: '15px' }}></div>
              <div style={{ fontSize: '15px', lineHeight: '2', color: '#ffffff', opacity: '0.9' }}>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                  <li>15 Hours Slow Roast Beef Belly with Truffle Demi-Glace</li>
                  <li>Chef Special's Birthday Noodles (Cha Misua)</li>
                  <li>Salted Egg Crabs (Deep-fried crabs in signature salted egg sauce)</li>
                  <li>Paella Bagnet (Filipino-Spanish fusion with crispy pork)</li>
                  <li>Chef Special's Mixed Salad with Russian Dressing</li>
                  <li>40 Cloves Garlic Chicken with Java Rice</li>
                  <li>Baked 4 Cheese Lobster Meat Rice</li>
                </ul>
              </div>
            </div>
            <div className="service-image">
              <img src={img1q} alt="Chef's Special" />
            </div>
          </div>

          <div className="service-row reverse">
            <div className="service-text">
              <h3>Signature Plated</h3>
              <div style={{ width: '40px', height: '2px', background: '#c49a2c', marginBottom: '15px' }}></div>
              <div style={{ fontSize: '15px', lineHeight: '2', color: '#ffffff', opacity: '0.9' }}>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                  <li>Sous Vide Beef Cheeks Kare-Kare</li>
                  <li>Garlic Rosemary Roasted Chicken Au Jus with Mashed Potatoes</li>
                  <li>Baked Salmon with Creamed Spinach and Mixed Vegetables</li>
                  <li>Sous Vide Roast Pork Loin with Mushroom Gravy</li>
                  <li>Grilled Prawns in Lemon Butter Sauce</li>
                  <li>Scallop Rockefeller or Baked Cheesy Mussels</li>
                  <li>Sous Vide Beef Lengua with Mixed Vegetables</li>
                </ul>
              </div>
            </div>
            <div className="service-image">
              <img src={sigPlatedImg} alt="Signature Plated" />
            </div>
          </div>

          <div className="service-row">
            <div className="service-text">
              <h3>International Menu</h3>
              <div style={{ width: '40px', height: '2px', background: '#c49a2c', marginBottom: '15px' }}></div>
              <div style={{ fontSize: '15px', lineHeight: '2', color: '#ffffff', opacity: '0.9' }}>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                  <li>Japanese Gyoza and Assorted Dimsum</li>
                  <li>Peking Duck (Marinated and roasted to a crisp)</li>
                  <li>Chicken Karaage with Japanese Mayonnaise</li>
                  <li>Yang Chow or Fookien Fried Rice</li>
                  <li>Korean Chap Chae (Stir-fry glass noodles)</li>
                  <li>Cordon Bleu with Creamy Mushroom Sauce</li>
                  <li>Beef Lasagna or Meaty Spaghetti Bolognese</li>
                  <li>Seafood Casserole and Baked Fish Fillet Parmigiano</li>
                </ul>
              </div>
            </div>
            <div className="service-image">
              <img src={internationalImg} alt="International Menu" />
            </div>
          </div>

       <div className="service-row reverse">
            <div className="service-text">
              <h3>Traditional Filipino</h3>
              <div style={{ width: '40px', height: '2px', background: '#c49a2c', marginBottom: '15px' }}></div>
              <div style={{ fontSize: '15px', lineHeight: '2', color: '#ffffff', opacity: '0.9' }}>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                  <li>Crispy Pork Bagnet in Kare-Kare Sauce</li>
                  <li>Sizzling Pork Sisig</li>
                  <li>Beef Tapsilog and Bangus Silog</li>
                  <li>Pinoy Style Spaghetti (Sweet style)</li>
                  <li>Lumpia Shanghai (Spring rolls)</li>
                  <li>Lechon Macau and Pork Adobo</li>
                  <li>Buko Pandan (Traditional dessert)</li>
                </ul>
              </div>
            </div>
            <div className="service-image">
              <img src={karekareImg} alt="Traditional Filipino" />
            </div>
          </div>

           <div className="service-row">
            <div className="service-text">
              <h3>Kids Menu</h3>
              <div style={{ width: '40px', height: '2px', background: '#c49a2c', marginBottom: '15px' }}></div>
              <div style={{ fontSize: '15px', lineHeight: '2', color: '#ffffff', opacity: '0.9' }}>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                  <li>Chicken Nuggets or Chicken Lollipops</li>
                  <li>Hotdog on a Stick with Marshmallows</li>
                  <li>Burger Steak with Mushroom Sauce</li>
                  <li>Macaroni and Cheese or Baked Macaroni</li>
                  <li>Mini Burgers with Cheese</li>
                  <li>Parmesan Chicken Wings</li>
                  <li>Assorted Pastries and Blondies</li>
                </ul>
              </div>
            </div>
            <div className="service-image">
              <img src={kidsMenuImg} alt="Kids Menu" />
            </div>
          </div>

        </div> {/* Closes the container */}
      </section>

      {/* 6. LOCATIONS WE WORK WITH SECTION */}
      <section className="locations-section">
        <div className="container">
          <h2>Locations We Work With</h2>
          <div className="gold-line"></div>
          <p className="locations-subtitle">
            Gala Crafters takes pride in extending its exceptional catering services in the Philippines to a variety
            of locations, ensuring that your special moments are adorned with culinary excellence, regardless
            of the venue.
          </p>

          <div className="locations-grid">
            <div className="location-card">
              <h3>Metro Manila</h3>
              <p>
                From Manila to Quezon City and Las Piñas, Gala Crafters
                brings unforgettable moments to every corner of Metro
                Manila. With renowned styling and award-winning
                cuisine, our tailored services promise an unforgettable
                experience.
              </p>
            </div>

            <div className="location-card">
              <h3>Greater Manila</h3>
              <p>
                Venturing beyond Metro Manila, our catering services
                gracefully reach the picturesque locales of Batangas and
                Laguna. These cities, just a stone's throw away, offer
                idyllic settings for outdoor venues and delightful
                experiences.
              </p>
            </div>

            <div className="location-card">
              <h3>Cavite</h3>
              <p>
                Delight in Gala Crafters's culinary expertise amidst Cavite's
                rich history, featuring the picturesque scenery of
                Tagaytay. Our services now reach this province,
                celebrated for its cultural heritage and natural beauty.
              </p>
            </div>
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

export default ServicesPage;