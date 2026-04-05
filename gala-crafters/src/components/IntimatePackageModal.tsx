import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Share2, Heart, Award, CheckCircle, Utensils, Music, Camera, Sparkles, MessageSquare } from 'lucide-react';
import './IntimatePackagePage.css';

// Using existing assets
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img1a.jpg';
import img3 from '../assets/banner-7.jpg';
import heroBg from '../assets/img2b.jpg';

function IntimatePackagePage() {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyPromo = () => {
    if (promoCode === 'GALA2024') {
      setIsPromoApplied(true);
    }
  };

  const basePrice = 5999;
  const serviceFee = basePrice * 0.10;
  const promoDiscount = isPromoApplied ? 500 : 0;
  const totalEstimated = basePrice + serviceFee - promoDiscount;

  return (
    <div className="package-details-wrapper">
      {/* 1. Header Area with Breadcrumbs */}
      <div className="package-header-bg">
        <div className="container package-header-content">

          <h1 className="package-main-title">Intimate Wedding Package</h1>
        </div>
      </div>

      <div className="container package-main-layout">
        {/* LEFT COLUMN: Gallery & Details */}
        <div className="package-left-col">
          
          {/* Gallery Section */}
          <div className="package-gallery">
            <div className="gallery-main-img">
              <img src={img1} alt="Intimate Wedding Garden" />
            </div>
            <div className="gallery-side-imgs">
              <div className="side-img-top">
                <img src={img2} alt="Intimate Table Setting" />
              </div>
              <div className="side-img-bottom-row">
                <div className="side-img-btm">
                  <img src={img3} alt="Floral Arrangement" />
                </div>
                <div className="side-img-btm">
                  <img src={heroBg} alt="Wedding Cake" />
                </div>
              </div>
            </div>
          </div>

          <div className="package-actions-row">
            <div className="package-tags-reviews">
              <span className="premium-tag">PREMIUM CHOICE</span>
              <div className="star-reviews">
                <span className="stars">☆☆☆☆☆</span>
                <span className="review-count">(48 Verified Reviews)</span>
              </div>
            </div>
            <div className="package-share-actions">
              <button className="icon-btn"><Share2 size={18} /></button>
              <button className="icon-btn"><Heart size={18} /></button>
            </div>
          </div>

          <p className="package-description-text">
            Experience a perfectly tailored celebration with our intimate wedding package. 
            Designed for those who seek meaningful connections, elegance, and a seamless planning journey for a smaller guest list. 
            From premium styling touches to a personalized dining menu, we ensure every delicate detail of your special day is executed to perfection.
          </p>

          {/* WHAT'S INCLUDED SECTION */}
          <div className="package-section">
            <h2 className="section-heading">WHAT'S INCLUDED</h2>
            <div className="gold-dash"></div>
            
            <div className="included-grid">
              <div className="included-card">
                <div className="included-icon"><Utensils size={24} color="#c49a2c" /></div>
                <div className="included-text">
                  <h4>Premium Catering</h4>
                  <p>3-course plated dinner, welcome drinks, and custom wedding cake.</p>
                </div>
              </div>
              <div className="included-card">
                <div className="included-icon"><Sparkles size={24} color="#c49a2c" /></div>
                <div className="included-text">
                  <h4>Elegant Decor</h4>
                  <p>Custom floral centerpieces, ambient lighting, and designer table linens.</p>
                </div>
              </div>
              <div className="included-card">
                <div className="included-icon"><Music size={24} color="#c49a2c" /></div>
                <div className="included-text">
                  <h4>Entertainment</h4>
                  <p>Professional acoustic duo or DJ, and premium sound system.</p>
                </div>
              </div>
              <div className="included-card">
                <div className="included-icon"><Camera size={24} color="#c49a2c" /></div>
                <div className="included-text">
                  <h4>Photography</h4>
                  <p>8 hours of coverage, 1 photographer, and a digital highlights album.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SERVICE DETAILS SECTION */}
          <div className="package-section">
            <h2 className="section-heading">SERVICE DETAILS</h2>
            <div className="gold-dash"></div>

            <div className="service-details-card">
              <p className="service-desc-paragraph">
                Our Intimate Package provides a dedicated event associate who will work with you for up to 3 months before the big day. The package includes a venue capacity of up to 50 guests, ensuring a cozy and heartfelt atmosphere.
              </p>
              
              <div className="service-checklist-grid">
                <div className="check-item">
                  <CheckCircle size={18} color="#c49a2c" className="check-icon" />
                  <span>Complimentary holding room</span>
                </div>
                <div className="check-item">
                  <CheckCircle size={18} color="#c49a2c" className="check-icon" />
                  <span>Custom seating & digital invites</span>
                </div>
                <div className="check-item">
                  <CheckCircle size={18} color="#c49a2c" className="check-icon" />
                  <span>Complete setup & breakdown</span>
                </div>
                <div className="check-item">
                  <CheckCircle size={18} color="#c49a2c" className="check-icon" />
                  <span>Rehearsal dinner coordination</span>
                </div>
              </div>
            </div>
          </div>

          {/* MORE EXPERIENCES SECTION */}
          <div className="package-section" style={{marginBottom: '60px'}}>
            <h2 className="section-heading">MORE EXPERIENCES</h2>
            <div className="gold-dash"></div>

             <div className="more-experiences-grid">
              
              {/* Card 1 */}
              <div className="experience-card">
                <div className="exp-img-container">
                  <span className="exp-price-badge">$12,499</span>
                  <img src={img2} alt="Utopian Experience" />
                </div>
                <div className="exp-card-body">
                  <h4>Utopian Wedding</h4>
                  <p>BALANCED ELEGANCE AND GRANDEUR.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="experience-card">
                <div className="exp-img-container">
                  <span className="exp-price-badge">$18,500</span>
                  <img src={img3} alt="Elite Experience" />
                </div>
                <div className="exp-card-body">
                  <h4>Elite Signature Gala</h4>
                  <p>THE PINNACLE OF LUXURY WEDDINGS.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="experience-card">
                <div className="exp-img-container">
                  <span className="exp-price-badge">$3,200</span>
                  <img src={heroBg} alt="Grand Milestone" />
                </div>
                <div className="exp-card-body">
                  <h4>Milestone Birthday</h4>
                  <p>CELEBRATE IN STYLE WITH MUSIC AND LIGHTS.</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Sidebar Form */}
        <div className="package-right-col">
          <div className="sticky-booking-widget">
            
            <div className="widget-header">
              <div className="total-price-label">
                <span>TOTAL PRICE</span>
                <span className="price-value">${basePrice.toLocaleString()}</span>
              </div>
              <p className="price-subtext">EXCLUDING ADDITIONAL CUSTOM ADD-ONS</p>
            </div>

            <div className="widget-form-group">
              <label>SELECT EVENT DATE</label>
              <div className="input-with-icon">
                 <input type="text" placeholder="DD/MM/YYYY" defaultValue="25/12/2024" />
                 <Calendar className="input-icon" size={16} />
              </div>
            </div>

            <div className="widget-form-group">
              <label>ESTIMATED GUESTS</label>
              <select defaultValue="1-50">
                <option value="1-50">1 - 50 Guests</option>
                <option value="51-100">51 - 100 Guests</option>
                <option value="101-200">101 - 200 Guests</option>
              </select>
            </div>

            <div className="widget-form-group promo-group">
              <label>PROMO CODE</label>
              <div className="promo-input-row">
                <input 
                  type="text" 
                  placeholder="GALA2024" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="apply-btn" onClick={handleApplyPromo}>APPLY</button>
              </div>
              {isPromoApplied && (
                <span className="promo-success">
                  <CheckCircle size={12} style={{marginRight: '4px'}}/> Code GALA2024 applied ($500 off!)
                </span>
              )}
            </div>

            <div className="pricing-breakdown">
              <div className="pricing-row">
                <span>Base Package</span>
                <span>${basePrice.toLocaleString()}</span>
              </div>
              <div className="pricing-row">
                <span>Service Fee (10%)</span>
                <span>${serviceFee.toLocaleString()}</span>
              </div>
              {isPromoApplied && (
                <div className="pricing-row discount-row">
                  <span>Promo Discount</span>
                  <span>-${promoDiscount}</span>
                </div>
              )}
              <div className="pricing-row total-row">
                <span>Total Estimated</span>
                <span className="total-accent">${totalEstimated.toLocaleString()}</span>
              </div>
            </div>

            <button className="reserve-now-btn">
              RESERVE NOW &rarr;
            </button>

            <p className="reserve-disclaimer">
              NO IMMEDIATE PAYMENT REQUIRED. WE WILL CONTACT YOU TO CONFIRM DETAILS AND FINALIZE BOOKING.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default IntimatePackagePage;
