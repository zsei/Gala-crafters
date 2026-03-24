import React, { useEffect, useState } from 'react';
import BookingModal from './BookingModal';

// Assets
import heroBg from '../assets/girl.jpg'; 
import img1 from '../assets/img1.jpg'; 
import img2 from '../assets/img5.jpg'; 
import img3 from '../assets/img3.jpg'; 
import { FaGift, FaRegHeart } from "react-icons/fa";

function CorporateEventPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const debutPackages = [
    {
      id: 1,
      title: "Intimate",
      pax: "Minimum 20 pax",
      inclusions: [
        "Appertizer", "Soup", "Salad", "Beef", "Pork", "Chicken", "Fish", "Pasta", "Vegetables", "Dessert",
        "Open Buffet Service", "Chinaware, Glassware & Silverware", "Table linens in a stunning array of colors",
        "Stylish Couch & Thematic Backdrop", "VIP Setup and Seated Service (40 pax above)",
        "Customized Menu Cards & Place Cards", "Round Table with Tiffany Chairs",
        "Table for the Cake, Gifts & Registration", "Beverage Bar Setup", 
        "Purified Drinking Water and Ice", "Waiters and Pantry in Uniform"
      ]
    },
    {
      id: 2,
      title: "Classy",
      pax: "Minimum 100 pax",
      inclusions: [
        "Appertizer", "Soup Bar", "Salad Station", "Beef or Pork Carving Stations", "Beef or Pork Entrees",
        "Chicken", "Fish", "Pasta", "Vegetables", "House Blend Lemon Iced Tea", "Open Buffet Service",
        "Chinaware, Glassware & Silverware", "Table linens in a stunning array of colors",
        "VIP Set-Up: Stylish Couch & Backdrop", "Elegant Set-Up & Service for VIPs (24 pax)",
        "Customized Menu Cards & Place Cards", "Round Table with Tiffany Chairs",
        "Table Centerpieces with Tealights", "18 Roses and 18 Shots", "Three Layered Fondant Cake",
        "Menu Labels at the Buffet Tables", "Table Nos., Registration, Gifts & Cake Table",
        "Wine Service for the VIPs", "Bar Set-Up for Beverage Station", "Waiters and Pantry in Uniform"
      ]
    },
    {
      id: 3,
      title: "Vogue",
      pax: "Minimum 100 pax",
      inclusions: [
        "Cocktails with Welcome Drinks", "Soup Bar", "Salad Station", "Beef Carving Stations", "Pork Carving Stations",
        "Chicken", "Fish", "Pasta", "Vegetables", "House Blend Lemon Iced Tea", "Brewed Coffee and Tea",
        "Open Buffet Service", "Chinaware, Glassware & Silverware", "Table linens in a stunning array of colors",
        "VIP Set-Up: Stylish Couch & Backdrop", "Elegant Set-Up & Service for VIPs (30 pax)",
        "Customized Menu Cards & Place Cards", "Round Table with Tiffany Chairs",
        "Table Centerpieces with Tealights", "18 Roses and 18 Shots", "Three Layered Fondant Cake or Sound & Lights",
        "Reception Cocktail Tables", "Menu Labels at the Buffet Tables", "Table Nos., Registration, Gifts & Cake Table",
        "Wine Service for the VIPs", "Bar Set-Up for Beverage Station", "Waiters and Pantry in Uniform"
      ]
    }
  ];

  return (
    <div className="debut-page-wrapper" style={{ backgroundColor: '#ffffff', paddingBottom: '0px' }}>

      {/* 1. HERO BANNER */}
      <div className="debut-hero">
        <img src={heroBg} alt="Debut Background" className="debut-hero-bg" />
        <div className="debut-hero-overlay"></div>
        <div className="container debut-hero-content">
          <h1>Debuts</h1>
        </div>
      </div>

      {/* 2. GALLERY SECTION (WITH FULL TEXT RESTORED) */}
      <section className="debut-gallery-section" style={{ padding: '80px 0' }}>
        <div className="debut-gallery-header">
          <h2>Gala Crafters Debut Catering Services</h2>
          <p>
            The debut - which comes only once in every lifetime - is a cherished occasion that marks every woman's transcendence into early adulthood. It's undoubtedly a very important part of life, and with Gala Crafters at your side you're sure to want for nothing during the affair. Our service's bespoke approach is sure to cater to every need, making every moment a worthwhile one.
          </p>
        </div>
        <div className="debut-gallery-grid">
          <div className="debut-gallery-item gal-wide"><img src={img1} alt="Gala" /></div>
          <div className="debut-gallery-item gal-tall"><img src={img2} alt="Gala" /></div>
          <div className="debut-gallery-item gal-standard"><img src={img3} alt="Gala" /></div>
          <div className="debut-gallery-item gal-standard"><img src={img1} alt="Gala" /></div>
          <div className="debut-gallery-item gal-standard"><img src={img2} alt="Gala" /></div>
          <div className="debut-gallery-item gal-standard"><img src={img3} alt="Gala" /></div>
        </div>
      </section>

{/* 5. DEBUT EXPERIENCE SECTION */}
<section className="debut-experience-section">
  <div className="container debut-experience-container">

    <div className="debut-experience-text">
      <h2>The Debut Experience</h2>

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
  <div className="container why-choose-container">

    <div className="why-choose-image">
      <img src={img3} alt="Debut Event" />
    </div>

    <div className="why-choose-content">
      <h2>Why Choose Juan Carlo as Your Debut Caterer in the Philippines</h2>

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

      {/* 4. PACKAGE INCLUSIONS */}
      <section className="debut-packages-section container" style={{ padding: '100px 0' }}>
        <div className="packages-header-section" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="packages-overline" style={{ letterSpacing: '2px', fontSize: '14px', fontWeight: '600', display: 'block' }}>PACKAGE INCLUSIONS</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', marginTop: '10px' }}>
            Our services include<br/>(but not limited to):
          </h2>
        </div>

        <div className="packages-grid debut-grid">
          {debutPackages.map((pkg) => (
            <div key={pkg.id} className="package-card debut-card">
              <div className="package-card-header debut-header">
                <h3>{pkg.title}</h3>
                <p>{pkg.pax}</p>
              </div>
              <ul className="package-inclusions-list debut-list">
                {pkg.inclusions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CORPORATE EVENT BANNER (Added for Booking) */}
      <section className="corporate-banner-section">
        <div className="corporate-banner-container">
          <div className="corporate-img-left">
            <img src={img1} alt="Corporate Event Left" />
          </div>
          <div className="corporate-banner-box">
            <h2>Elevate Your Corporate Event With Gala Crafters!</h2>
            <p>
              For corporate catering in the Philippines, trust Gala Crafters. We're here to provide you with the best services with our professional team.
            </p>
            <button className="corporate-btn" onClick={() => setIsModalOpen(true)}>
              Book a Tasting Experience with Gala Crafters
            </button>
          </div>
          <div className="corporate-img-right">
            <img src={img1} alt="Corporate Event Right" />
          </div>
        </div>
      </section>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialEventType="Corporate"
      />

    </div>
  );
}

export default CorporateEventPage;