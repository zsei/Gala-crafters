import React from 'react';
import './ServicesSlider.css';
import { Link } from 'react-router-dom';

// Imgs for hover
import wedImg from '../assets/img1.jpg';
import corpImg from '../assets/img2a.jpg';
import debutImg from '../assets/debut1.jpg';

export interface ServiceItem {
  title: string;
  desc: string;
  link: string;
  bg: string;
  onClick?: () => void;
}

interface ServicesSliderProps {
  title?: string;
  desc?: string;
  overline?: string | null;
  services?: ServiceItem[];
}

const defaultServices: ServiceItem[] = [
  {
    title: "Weddings",
    desc: "With magnificent food offerings and unparalleled service, our wedding catering services craft a celebration that marks the unforgettable union of love and joy.",
    link: "/wedding",
    bg: wedImg
  },
  {
    title: "Corporate Events",
    desc: "We transform ordinary corporate gatherings into extraordinary moments of collaboration and celebration with our best food selection and event services.",
    link: "/corporate-event",
    bg: corpImg
  },
  {
    title: "Debuts",
    desc: "Ensuring every moment is worthwhile, our catering and event styling approach caters to your every need, making your debut a cherished occasion filled with extraordinary experiences.",
    link: "/debut",
    bg: debutImg
  }
];

const ServicesSlider: React.FC<ServicesSliderProps> = ({ 
  title = "Celebrate with Gala Crafters",
  desc = "From corporate events to debuts, event stylings, and weddings, the catering services of Gala Crafters elevate every occasion with noteworthy food selections and bespoke services, creating unforgettable moments that transcend the ordinary.",
  overline = null,
  services = defaultServices
}) => {
  return (
    <section className="services-slider-section">
      <div className="services-slider-container">
        <div className="services-slider-header-row">
          <div className="services-slider-text">
            {overline && <span className="services-overline">{overline}</span>}
            <h2 className="services-title" style={{ color: '#c49a2c', fontWeight: '700' }}>{title}</h2>
            <div className="gold-line" style={{ margin: '15px 0 25px 0' }}></div>
            <p className="services-desc">
              {desc}
            </p>
          </div>
        </div>

        <div className="services-slider-track">
          {services.map((svc, idx) => (
            <div 
              key={idx} 
              className="services-slider-card" 
              onClick={() => svc.onClick?.()}
              style={{ 
                '--hover-bg': `url(${svc.bg})`,
                cursor: svc.onClick ? 'pointer' : 'default'
              } as React.CSSProperties}
            >
              <div className="card-bg-overlay"></div>
              <div className="card-content">
                <h3 style={{ color: '#c49a2c', fontWeight: '500' }}>{svc.title}</h3>
                <div className="gold-line" style={{ margin: '15px 0' }}></div>
                <p>{svc.desc}</p>
                {svc.onClick ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      svc.onClick?.();
                    }} 
                    className="read-more" 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      padding: 0, 
                      textAlign: 'left', 
                      width: '100%', 
                      color: '#c49a2c', // Changed from inherit to gold
                      fontSize: 'inherit',
                      fontFamily: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    View Details &rarr;
                  </button>
                ) : (
                  <Link to={svc.link} className="read-more">View Details &rarr;</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSlider;
