import React from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import './ClientTestimonials.css';

import av1 from '../assets/img1.jpg';
import av2 from '../assets/img2a.jpg';
import av3 from '../assets/debut1.jpg';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Dennis and Jen',
    location: 'Wedding Clients',
    avatar: av1,
    text: 'Thank you! Sarap ng food! The styling was incredible and exceeded all our expectations for our special day. Highly recommended!',
    rating: 5
  },
  {
    id: 2,
    name: 'Tracye Lawyer',
    location: 'Corporate Event',
    avatar: av2,
    text: "Gala Crafters transformed our corporate gala into an unforgettable experience. Their attention to detail and professionalism is unmatched.",
    rating: 5
  },
  {
    id: 3,
    name: 'Angeline Chua',
    location: 'Debut Celebration',
    avatar: av3,
    text: "The most beautiful debut I've ever seen. Every detail, from the floral arrangements to the lighting, was absolutely perfect.",
    rating: 5
  }
];

interface ClientTestimonialsProps {
  variant?: 'dark' | 'light';
}

const ClientTestimonials: React.FC<ClientTestimonialsProps> = ({ variant = 'dark' }) => {
  return (
    <section className={`client-testimonials-section theme-${variant}`}>
      <div className="container testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonial-title">Real People, Real Result</h2>
          <div className="gold-line" style={{ margin: '15px auto 25px auto' }}></div>
          <p className="testimonial-desc">
            Our clients share authentic and heartfelt experiences, offering a genuine glimpse into the impact of our exquisite culinary and service.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((item) => (
            <div key={item.id} className="testimonial-card">
              <div className="card-header">
                <div className="author-meta">
                  <div className="avatar-wrapper initial-avatar">
                    {item.name.charAt(0)}
                  </div>
                  <div className="author-info">
                    <h4>{item.name}</h4>
                  </div>
                </div>
                <div className="quote-icon">
                  <Quote size={32} fill="#c49a2c1a" stroke="#c49a2c" strokeWidth={1} />
                </div>
              </div>
              
              <div className="card-body">
                <p className="review-text">{item.text}</p>
              </div>

              <div className="card-footer">
                <div className="star-rating">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#c49a2c" color="#c49a2c" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-nav">
          <button className="nav-btn prev" aria-label="Previous testimonial">
            <ChevronLeft size={20} />
          </button>
          <button className="nav-btn next" aria-label="Next testimonial">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonials;
