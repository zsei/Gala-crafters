import React, { useState, useRef, useEffect } from 'react';
import bgImage from '../assets/img3.jpg';
import { API_BASE_URL } from '../api/config';

function ContactUsPage() {
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const payload = {
      name: fullName,
      email: email,
      message_body: `[Event: ${selectedEvent || 'Not Specified'}] [Phone: +63 9${phone}] ${message}`,
      subject: selectedEvent ? `${selectedEvent.charAt(0).toUpperCase() + selectedEvent.slice(1)} Inquiry` : "General Inquiry"
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus({ type: 'success', text: 'Thank you! Your inquiry has been sent successfully.' });
        setFullName('');
        setEmail('');
        setPhone('');
        setSelectedEvent('');
        setMessage('');
      } else {
        throw new Error('Failed to send inquiry');
      }
    } catch (err: any) {
      setStatus({ type: 'error', text: 'Something went wrong. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };
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
              {status && (
                <div style={{
                  padding: '15px',
                  marginBottom: '20px',
                  borderRadius: '8px',
                  backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: status.type === 'success' ? '#10b981' : '#ef4444',
                  fontSize: '14px',
                  textAlign: 'center',
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  {status.text}
                </div>
              )}
              <form className="contact-inquiry-form" onSubmit={handleSubmit}>

                <div className="contact-form-group">
                  <label>FULL NAME:</label>
                  <input
                    type="text"
                    placeholder="e.g. Julianne Sterling"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(/[^A-Za-z. ]/g, '');
                    }}
                  />
                </div>

                <div className="contact-form-group">
                  <label>EMAIL:</label>
                  <input 
                    type="email" 
                    placeholder="hello@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>

                <div className="contact-form-group">
                  <label>PHONE NUMBER:</label>
                  <div className="phone-input-wrapper">
                    <span className="phone-prefix">+63 9</span>
                    <input
                      type="tel"
                      placeholder="123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
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
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="form-submit-btn" 
                  disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default ContactUsPage;
