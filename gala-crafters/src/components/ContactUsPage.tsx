import React from 'react';
// import mainBg from '../assets/img3.jpg'; // Image removed per request

function ContactUsPage() {
  return (
    <div className="contact-page-wrapper">
      <section className="contact-hero-section">
        <div className="container contact-container">
          
          {/* TEXT CONTENT */}
          <div className="contact-text-side">
            <span className="contact-overline">GET IN TOUCH</span>
            <h2 className="contact-heading">
              Crafting Your <br />
              <span className="contact-heading-italic">Masterpiece</span>
            </h2>
            <p className="contact-paragraph">
              Whether it is a grand gala or an intimate gathering, our bespoke floral artistry brings your vision to life with timeless elegance.
            </p>
            
            <div className="contact-details-box">
              <div className="contact-detail-group">
                <span className="detail-title">OUR STUDIO</span>
                <p>128 Floral Avenue, Design District<br/>New York, NY 10012</p>
              </div>
              <div className="contact-detail-group">
                <span className="detail-title">INQUIRIES</span>
                <p>hello@galacrafters.com<br/>+1 (555) 888-2345</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default ContactUsPage;
