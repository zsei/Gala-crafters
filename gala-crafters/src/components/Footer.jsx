import React from 'react';
import { useLocation } from 'react-router-dom'; // 1. IMPORT USELOCATION

// Keep your icon variables here
const IconWeb = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c49a2c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c49a2c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c49a2c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

function Footer() {
  // 2. CHECK THE CURRENT PAGE
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <footer className="main-footer">
      
      {/* 3. CONDITIONAL RENDER: Only show this block if we are on Home */}
      {isHome && (
        <section className="cta-section">
          <div className="container">
            <h2 className="cta-title">DEFINE YOUR MOMENT.</h2>
            <p className="cta-text">
              Currently accepting inquiries for 2026/2027. Join our list of distinguished clients 
              who settle for nothing less than absolute perfection.
            </p>
            <button className="cta-btn">BEGIN YOUR STORY</button>
          </div>
        </section>
      )}

      {/* SECTION 2: ACTUAL FOOTER (This stays on all pages) */}
      <div className="footer-content">
        <div className="container footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col brand-col">
            <div className="logo gold">
              <div className="diamond"></div>
              GALA CRAFTERS
            </div>
            <p className="footer-bio">
              The world's premier destination for high-end event planning and editorial design. 
              Excellence is our only standard.
            </p>
            <div className="social-links">
              <div className="social-box"><IconWeb /></div>
              <div className="social-box"><IconMail /></div>
              <div className="social-box"><IconInstagram /></div>
            </div>
          </div>

          {/* Column 2: Studio Links */}
          <div className="footer-col">
            <h4>STUDIO</h4>
            <ul>
              <li>Our Process</li>
              <li>Journal</li>
              <li>Portfolio</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* Column 3: Location */}
          <div className="footer-col">
            <h4>LOCATION</h4>
            <address>
              San Lazaro Yakal<br />
              Tala Caloocan City<br />
              <a href="mailto:info@galacrafters.com">info@galacrafters.com</a>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="container bottom-flex">
            <p>© 2026 GALA CRAFTERS. ALL RIGHTS RESERVED.</p>
            <div className="legal-links">
              <span>PRIVACY POLICY</span>
              <span>TERMS OF SERVICE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;