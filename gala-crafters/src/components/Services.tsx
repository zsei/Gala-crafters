import MenuSlider from './MenuSlider';
import ClientTestimonials from './ClientTestimonials';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/glamour-2.jpg';
import img2 from '../assets/glamour-3.jpg';
import img3 from '../assets/glamour-4.jpg';
import img4 from '../assets/banner-9.jpg';
import corporateImg from '../assets/img2.jpg';
import birthdayImg from '../assets/bd1.png';
import img5 from '../assets/DSC9804.jpg';
import img6 from '../assets/DSC9849.jpg';
import img7 from '../assets/DSC9850.jpg';
import img8 from '../assets/DSC9852.jpg';

// Gallery Images for Art Section
import debut12 from '../assets/debut12.jpg';
import girl from '../assets/girl.jpg';
import img2a from '../assets/img2a.jpg';
import img2b from '../assets/img2b.jpg';
import wed1 from '../assets/wed1.jpg';
import wed2 from '../assets/wed2.jpg';
import kid from '../assets/kid.jpg';
import gold from '../assets/gold.jpg';

const galleryImages = [debut12, girl, img2a, img2b, wed1, wed2, kid, gold];

// Gold SVG Icons
const IconPalette = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2C10.06 2 2 10.06 2 20C2 29.94 10.06 38 20 38C22.25 38 24 36.25 24 34C24 33 23.6 32.1 23 31.4C22.4 30.7 22 29.8 22 28.8C22 26.6 23.8 24.8 26 24.8H31C34.8 24.8 38 21.6 38 17.8C38 9.06 29.94 2 20 2ZM10 20C8.9 20 8 19.1 8 18C8 16.9 8.9 16 10 16C11.1 16 12 16.9 12 18C12 19.1 11.1 20 10 20ZM16 12C14.9 12 14 11.1 14 10C14 8.9 14.9 8 16 8C17.1 8 18 8.9 18 10C18 11.1 17.1 12 16 12ZM24 12C22.9 12 22 11.1 22 10C22 8.9 22.9 8 24 8C25.1 8 26 8.9 26 10C26 11.1 25.1 12 24 12ZM30 20C28.9 20 28 19.1 28 18C28 16.9 28.9 16 30 16C31.1 16 32 16.9 32 18C32 19.1 31.1 20 30 20Z" fill="#c49a2c" />
  </svg>
);

const IconSparkle = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" fill="#c49a2c" />
    <path d="M19 14L19.8 17.2L23 18L19.8 18.8L19 22L18.2 18.8L15 18L18.2 17.2L19 14Z" fill="#c49a2c" opacity="0.6" />
    <path d="M5 14L5.6 16.4L8 17L5.6 17.6L5 20L4.4 17.6L2 17L4.4 16.4L5 14Z" fill="#c49a2c" opacity="0.8" />
  </svg>
);

const IconCheckmarkCircle = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c49a2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const collections = [
  { id: 1, title: 'Weddings', subtitle: 'CLASSIC CELEBRATION', img: img1 },
  { id: 2, title: 'Corporate Galas', subtitle: 'PROFESSIONAL EVENTS', img: corporateImg },
  { id: 3, title: 'Birthdays', subtitle: 'PERSONAL PARTIES', img: birthdayImg },
  { id: 4, title: 'Private Soirees', subtitle: 'INTIMATE ELEGANCE', img: img4 },
];

function Services() {
  const navigate = useNavigate();
  return (
    <>
      {/* SECTION 1: PHOTO GALLERY (White Background) */}
      <section className="services-section collections-grayscale">
        <div className="container">
          <div className="services-intro">
            <h2 style={{ color: '#c49a2c' }}>Crafter's Collections</h2>
            <div className="gold-line"></div>
            <p>FROM BIG WEDDINGS AND PRIVATE PARTIES, WE MAKE IT HAPPEN.</p>
          </div>

          <div className="services-grid">
            {/* FIXED: Now mapping through the collections correctly */}
            {collections.map((item) => (
              <div key={item.id} className="service-item">
                <div className="image-container">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="service-info">
                  <h4>{item.title}</h4>
                  <span>{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: MENU SLIDER */}
      <MenuSlider />

      {/* SECTION 2: WHY CHOOSE GALA CRAFTERS (Light Cream Background) */}
      <section className="excellence-section philosophy-bg">
        <div className="container">
          <div className="philosophy-header">
            <span className="philosophy-subtitle">OUR PHILOSOPHY</span>
            <h2 className="philosophy-main-title">Why Choose Gala Crafters</h2>
          </div>

          <div className="philosophy-grid">
            <div className="philosophy-card">
              <div className="philosophy-icon-circle">
                <IconPalette />
              </div>
              <h4>Bespoke Curation</h4>
              <p>Every event is a unique canvas. we tailor every element to reflect your personal narrative and aesthetic vision.</p>
            </div>
            <div className="philosophy-card">
              <div className="philosophy-icon-circle">
                <IconSparkle />
              </div>
              <h4>Exquisite Detail</h4>
              <p>From the texture of the linens to the scent of the florals, we obsess over the details that define luxury.</p>
            </div>
            <div className="philosophy-card">
              <div className="philosophy-icon-circle">
                <IconCheckmarkCircle />
              </div>
              <h4>Seamless Execution</h4>
              <p>Rest easy knowing our logistics experts handle every moving part with quiet, professional precision.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: ART OF GALA CRAFTERS */}
      <section className="services-section art-gallery-section" style={{ paddingTop: '100px', backgroundColor: '#0a0f1d' }}>
        <div className="container">
          <div className="services-intro" style={{ 
            textAlign: 'left', 
            marginBottom: '40px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'baseline' 
          }}>
            <div className="titles-wrapper">
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '42px', fontWeight: 'bold' }}>
                <span style={{ color: '#ffffff', fontFamily: '"Playfair Display", serif' }}>Gallery of </span>
                <span style={{ color: '#c49a2c', fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>Moments</span>
              </h2>
              <div className="gold-line" style={{ margin: '15px 0 25px 0' }}></div>
            </div>
            
            <div 
              style={{ 
                color: '#c49a2c', 
                fontSize: '12px', 
                fontWeight: '700', 
                letterSpacing: '1.5px', 
                cursor: 'pointer', 
                textTransform: 'uppercase', 
                borderBottom: '1px solid #c49a2c', 
                padding: '5px 0',
                fontFamily: '"DM Sans", sans-serif'
              }}
              onClick={() => navigate('/events')}
            >
              VIEW COLLECTION
            </div>
          </div>

          <div className="art-grid">
            {galleryImages.map((imgUrl, index) => (
              <div key={index} className="art-item">
                <img src={imgUrl} alt={`Gala Crafters Art ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <ClientTestimonials variant="light" />
    </>
  );
}

export default Services;