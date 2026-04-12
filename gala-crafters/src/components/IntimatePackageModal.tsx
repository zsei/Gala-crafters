import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Utensils, Music, Camera, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../api/config';
import './IntimatePackagePage.css';

// Using existing assets
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img1a.jpg';
import img3 from '../assets/banner-7.jpg';
import heroBg from '../assets/img2b.jpg';

function IntimatePackagePage() {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoDiscountAmount, setPromoDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoValidating, setPromoValidating] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const basePrice = 5999;

  const handleApplyPromo = async () => {
    setPromoError(null);
    const trimmed = promoCode.trim();
    if (!trimmed) {
      setPromoError('Enter a promo code');
      return;
    }
    setPromoValidating(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE_URL}/api/promo-codes/validate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ code: trimmed }),
      });
      const body = await res.json();
      if (!body.valid) {
        setIsPromoApplied(false);
        setPromoDiscountAmount(0);
        setAppliedPromoCode(null);
        setPromoError(body.message || 'Invalid code');
        return;
      }
      const subtotal = basePrice;
      let discount = 0;
      if (body.discount_percentage != null && body.discount_percentage > 0) {
        discount = Math.min(subtotal, Math.round((subtotal * body.discount_percentage) / 100));
      } else if (body.discount_amount != null && body.discount_amount > 0) {
        discount = Math.min(subtotal, body.discount_amount);
      }
      if (discount <= 0) {
        setIsPromoApplied(false);
        setPromoDiscountAmount(0);
        setAppliedPromoCode(null);
        setPromoError('This code has no discount configured.');
        return;
      }
      setPromoDiscountAmount(discount);
      setIsPromoApplied(true);
      setAppliedPromoCode(body.code);
    } catch {
      setPromoError('Could not verify promo code. Try again.');
      setIsPromoApplied(false);
      setPromoDiscountAmount(0);
      setAppliedPromoCode(null);
    } finally {
      setPromoValidating(false);
    }
  };

  const totalEstimated = basePrice - promoDiscountAmount;

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
              <div className="star-reviews">
                <span className="stars">☆☆☆☆☆</span>
                <span className="review-count">(48 Verified Reviews)</span>
              </div>
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
                <div className="included-icon"><Utensils size={32} color="#c49a2c" strokeWidth={1.75} /></div>
                <div className="included-text">
                  <h4>Premium Catering</h4>
                  <p>3-course plated dinner, welcome drinks, and custom wedding cake.</p>
                </div>
              </div>
              <div className="included-card">
                <div className="included-icon"><Sparkles size={32} color="#c49a2c" strokeWidth={1.75} /></div>
                <div className="included-text">
                  <h4>Elegant Decor</h4>
                  <p>Custom floral centerpieces, ambient lighting, and designer table linens.</p>
                </div>
              </div>
              <div className="included-card">
                <div className="included-icon"><Music size={32} color="#c49a2c" strokeWidth={1.75} /></div>
                <div className="included-text">
                  <h4>Entertainment</h4>
                  <p>Professional acoustic duo or DJ, and premium sound system.</p>
                </div>
              </div>
              <div className="included-card">
                <div className="included-icon"><Camera size={32} color="#c49a2c" strokeWidth={1.75} /></div>
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
                  placeholder="Enter promo code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="button" className="apply-btn" onClick={handleApplyPromo} disabled={promoValidating}>
                  {promoValidating ? '…' : 'APPLY'}
                </button>
              </div>
              {promoError && (
                <span className="promo-error" style={{ color: '#e85d5d', fontSize: 12, display: 'block', marginTop: 6 }}>{promoError}</span>
              )}
              {isPromoApplied && appliedPromoCode && (
                <span className="promo-success">
                  <CheckCircle size={12} style={{marginRight: '4px'}}/> Code {appliedPromoCode} applied (${promoDiscountAmount.toLocaleString()} off!)
                </span>
              )}
            </div>

            <div className="pricing-breakdown">
              <div className="pricing-row">
                <span>Base Package</span>
                <span>${basePrice.toLocaleString()}</span>
              </div>
              {isPromoApplied && promoDiscountAmount > 0 && (
                <div className="pricing-row discount-row">
                  <span>Promo Discount</span>
                  <span>-${promoDiscountAmount.toLocaleString()}</span>
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
