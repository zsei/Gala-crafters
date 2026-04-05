import React, { useState, useRef, useEffect } from 'react';
import bgImage from '../assets/img3.jpg';

function ContactUsPage() {
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEventOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const eventOptions = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'childrens_party', label: 'Childrens Party' },
    { value: 'debut', label: 'Debut' },
    { value: 'special_occasion', label: 'Special Occasion' },
    { value: 'corporate_event', label: 'Corporate Event' },
    { value: 'other', label: 'Other' },
  ];
  return (
    <div className="contact-page-wrapper contact-hero-dark" style={{ padding: 0, margin: 0, minHeight: '100vh' }}>
      <section
        className="enhanced-vm-section enhanced-vision"
        style={{
          '--bg-img': `url(${bgImage})`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '0'
        } as React.CSSProperties}
      >
        <div className="contact-two-col" style={{ width: '100%', maxWidth: '1500px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', gap: '60px' }}>

          {/* LEFT COLUMN: TEXT CONTENT */}
          <div className="contact-left-col" style={{ flex: 1, maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="contact-overline" style={{ marginBottom: '20px', color: '#ffffff', fontSize: '12px' }}>GET IN TOUCH</span>
            <div style={{ marginLeft: 0, marginTop: 0 }}>
              <h2 className="contact-heading" style={{ fontSize: '75px', marginTop: '15px', fontFamily: "'Playfair Display', serif", fontWeight: 900, letterSpacing: '-3px', lineHeight: 1 }}>
                Crafting Your <br />
                <span className="contact-heading-italic" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900, letterSpacing: '-3px' }}>Masterpiece</span>
              </h2>
              <p className="contact-paragraph" style={{ marginBottom: '30px', fontFamily: "'DM Sans', sans-serif", fontSize: '16px' }}>
                Whether it is a grand gala or an intimate gathering, our bespoke floral artistry brings your vision to life with timeless elegance.
              </p>

              <div className="contact-details-box">
                <div className="contact-detail-group">
                  <span className="detail-title" style={{ fontSize: '11px', color: '#c49a2c' }}>OUR LOCATION</span>
                  <p style={{ margin: 0 }}>San Lazaro Yakal<br />Tala, Caloocan City</p>
                </div>
                <div className="contact-detail-group" style={{ marginTop: '20px' }}>
                  <span className="detail-title" style={{ fontSize: '11px', color: '#c49a2c' }}>EMAIL</span>
                  <p style={{ margin: 0 }}>galacrafterssupport@gmail.com<br />(+63)9514567875</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM BOX */}
          <div className="contact-right-col" style={{ flex: 1, maxWidth: '500px', width: '100%' }}>
            <div className="contact-form-card">
              <form className="contact-inquiry-form" onSubmit={(e) => e.preventDefault()}>

                <div className="contact-form-group">
                  <label>FULL NAME:</label>
                  <input
                    type="text"
                    placeholder="e.g. Julianne Sterling"
                    required
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(/[^A-Za-z. ]/g, '');
                    }}
                  />
                </div>

                <div className="contact-form-group">
                  <label>EMAIL:</label>
                  <input type="email" placeholder="hello@example.com" required />
                </div>

                <div className="contact-form-group">
                  <label>PHONE NUMBER:</label>
                  <div className="phone-input-wrapper">
                    <span className="phone-prefix">+63 9</span>
                    <input
                      type="tel"
                      placeholder="123456789"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        // Only allow digits and limit to 9 characters 
                        target.value = target.value.replace(/[^0-9]/g, '').slice(0, 9);
                      }}
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label>EVENT:</label>
                  <div className="custom-dropdown" ref={dropdownRef}>
                    <div
                      className={`custom-dropdown-selected ${selectedEvent ? 'has-value' : ''}`}
                      onClick={() => setIsEventOpen(!isEventOpen)}
                    >
                      {selectedEvent ? eventOptions.find(o => o.value === selectedEvent)?.label : 'Select Event Type...'}
                      <span className="dropdown-arrow">▼</span>
                    </div>
                    {isEventOpen && (
                      <div className="custom-dropdown-options">
                        {eventOptions.map(option => (
                          <div
                            key={option.value}
                            className={`custom-dropdown-option ${selectedEvent === option.value ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedEvent(option.value);
                              setIsEventOpen(false);
                            }}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="contact-form-group">
                  <label>LEAVE A MESSAGE:</label>
                  <textarea
                    placeholder="Tell us about your vision..."
                    required
                    maxLength={100}
                  ></textarea>
                </div>

                <button type="submit" className="form-submit-btn">Send Inquiry</button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default ContactUsPage;
