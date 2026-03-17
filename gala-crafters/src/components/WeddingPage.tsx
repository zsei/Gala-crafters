import React, { useEffect, useState } from 'react';
import BookingModal from './BookingModal';

// Assets
import heroBg from '../assets/img2b.jpg';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img1a.jpg';
import img3 from '../assets/banner-7.jpg';
import { FaGift, FaRegHeart, FaCheckSquare } from "react-icons/fa";

function WeddingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const weddingPackages = [
    {
      id: 1,
      title: "Intimate",
      pax: "Minimum 20 pax",
      inclusions: [
        "Appertizer", "Soup", "Salad", "Beef", "Pork", "Chicken", "Fish", "Pasta", "Vegetables", "Dessert",
        "Open Buffet Service", "Chinaware, Glassware & Silverware", "Table linens in a stunning array of colors",
        "Stylish Couch & Thematic Backdrop", "VIP Setup and Seated Service (applicable for 40 pax above)",
        "Customized Menu Cards & Place Cards", "Round Table with Tiffany Chairs for all the Guests",
        "Table for the Cake, Gifts & Registration", "Beverage Bar Setup",
        "Purified Drinking Water and Ice for your Beverages", "Waiters and Pantry in Uniform with PPE Gears"
      ]
    },
    {
      id: 2,
      title: "Utopian",
      pax: "Minimum 100 pax",
      inclusions: [
        "Appertizer", "Soup Bar", "Salad Station", "Beef or Portk Carving Stations", "Beef or Pork Entrees",
        "Chicken", "Fish", "Pasta", "Vegetables", "House Blend Lemon Iced Tea", "Open Buffet Service",
        "Chinaware, Glassware & Silverware", "Table linens in a stunning array of colors",
        "VIP Set-Up: Stylish Couch & Backdrop", "Elegant Set-Up & Service for VIPs (24 pax)",
        "Customized Menu Cards & Place Cards", "Round Table with Tablecloth and Tiffany Chairs for all the Guests",
        "Table Centerpieces with Tealights", "Chilled Bottle of Wine for the toast of the Bride & Groom", "Three Layered Fondant Cake",
        "Wedding Aisle Runner", "Menu Labels at the Buffet Tables", "Table Nos. with Holders, Registration, Gifts & Cake Table",
        "Wine Service for the VIPs", "Bar Set-Up for Beverage Station", "Waiters and Pantry in Uniform with PPE Gears"
      ]
    },
    {
      id: 3,
      title: "Elite",
      pax: "Minimum 100 pax",
      inclusions: [
        "Cocktails with Welcome Drinks", "Soup Bar", "Salad Station", "Beef Carving Stations", "Pork Carving Stations",
        "Chicken", "Fish", "Pasta", "Vegetables", "House Blend Lemon Iced Tea", "Brewed Coffee and Tea",
        "Open Buffet Service", "Chinaware, Glassware & Silverware", "Table linens in a stunning array of colors",
        "VIP Set-Up: Stylish Couch & Backdrop", "Elegant Set-Up & Service for VIPs (30 pax)",
        "Customized Menu Cards & Place Cards", "Round Table with Tablecloth and Tiffany Chairs for all the Guests",
        "Table Centerpieces with Tealights", "Chilled Bottle of Wine for the toast of the Bride & Groom", "Three Layered Fondant Cake or Sound System & Lights",
        "Photowall", "Reception Cocktail Tables", "Wedding Aisle Runner", "Menu Labels at the Buffet Tables", "Table Nos. with Holders, Registration, Gifts & Cake Table",
        "Wine Service for the VIPs", "Bar Set-Up for Beverage Station", "Waiters and Pantry in Uniform with PPE Gears"
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
          <h1>Wedding</h1>
        </div>
      </div>

      {/* 2. GALLERY SECTION (WITH FULL TEXT RESTORED) */}
      <section className="debut-gallery-section" style={{ padding: '80px 0' }}>
        <div className="debut-gallery-header">
          <h2>Gala Crafters Wedding Catering Services</h2>
          <p>
            Your wedding day is a once-in-a-lifetime union, a cherished occasion that marks the beautiful beginning of your journey together. It's undoubtedly one of the most important moments of your life, and with Gala Crafters at your side, you're sure to want for nothing during the affair. Our service's bespoke approach is sure to cater to every need, making every moment a worthwhile one.
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

      {/* WHY SHOULD YOU HIRE SECTION */}
      <section className="wedding-hire-section">

        {/* FIRST ROW */}
        <div className="wedding-hire-row">

          <div className="wedding-hire-image">
            <img src={img2} alt="Wedding Ceremony" />
          </div>

          <div className="wedding-hire-text">
            <h2>Why Should You Hire a Wedding Catering Service</h2>
            <div className="orange-divider" style={{ marginBottom: '30px', marginTop: '-15px', width: '80px', backgroundColor: '#c49a2c' }}></div>

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
            <img src={img3} alt="Wedding Signing" />
          </div>

          <div className="wedding-hire-text">
            <h2>Why you should book Gala Crafters Wedding Package</h2>
            <div className="orange-divider" style={{ marginBottom: '30px', marginTop: '-15px', width: '80px', backgroundColor: '#c49a2c' }}></div>

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

      {/* 4. PACKAGE INCLUSIONS */}
      <section className="debut-packages-section container" style={{ padding: '100px 0' }}>
        <div className="packages-header-section" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="packages-overline" style={{ letterSpacing: '2px', fontSize: '14px', fontWeight: '600', display: 'block', color: '#333' }}>PACKAGE INCLUSIONS</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', marginTop: '10px', fontWeight: '900' }}>
            Our services include<br />(but not limited to):
          </h2>
        </div>

        <div className="packages-grid debut-grid">
          {weddingPackages.map((pkg) => (
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

      {/* CORPORATE EVENT BANNER */}
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
            <img src={img2} alt="Corporate Event Right" />
          </div>
        </div>
      </section>

      {/* 5. TRADEMARK SECTION */}
      <section className="trademark-section">
        <div className="trademark-container">
          <div className="trademark-header">
            <h2>Our Trademark Full Service</h2>
            <p>
              Having been the consistent choice of many of tinseltown's biggest celebrities and companies, Gala Crafters is an expert in defining the quality of its food and service.
            </p>
          </div>
          <div className="trademark-grid">
            <div className="trademark-card">
              <div className="trademark-card-bg" style={{ backgroundImage: `url(${img1})` }}></div>
              <div className="trademark-card-content">
                <h3>Event Styling</h3>
                <p>From thematic backdrops to personalized details, we tailor the ambiance of your event according to your preferences.</p>
                <a href="#" className="read-more">Read More &rarr;</a>
              </div>
            </div>
            <div className="trademark-card">
              <div className="trademark-card-bg" style={{ backgroundImage: `url(${img3})` }}></div>
              <div className="trademark-card-content">
                <h3>Catering Packages</h3>
                <p>Elevate your event with our customizable catering packages, meticulously crafted to suit your unique tastes and preferences. We offer a culinary experience that delights and impresses.</p>
                <a href="#" className="read-more">Read More &rarr;</a>
              </div>
            </div>
            <div className="trademark-card">
              <div className="trademark-card-bg" style={{ backgroundImage: `url(${img2})` }}></div>
              <div className="trademark-card-content">
                <h3>Venues</h3>
                <p>Partner with venues that we trust to make your dream celebration a reality. Whether you want an outdoor venue or something more intimate, there are many choices for you.</p>
                <a href="#" className="read-more">Read More &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </section>



      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialEventType="Wedding"
      />

    </div>
  );
}

export default WeddingPage;