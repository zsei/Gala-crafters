import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import './ClientTestimonials.css';
import { API_BASE_URL } from '../api/config';

import av1 from '../assets/img1.jpg';
import av2 from '../assets/img2a.jpg';
import av3 from '../assets/debut1.jpg';

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    name: 'Angeline Khaleira',
    location: 'Wedding Clients',
    avatar: av1,
    text: 'The service is AMAZING!! Everything was handled with such professionalism and care.',
    rating: 5
  },
  {
    id: 2,
    name: 'Manuel Gonzales',
    location: 'Corporate Event',
    avatar: av2,
    text: "Gala Crafters transformed our corporate gala into an unforgettable experience. Truly exceptional.",
    rating: 5
  },
  {
    id: 3,
    name: 'Gabriel Ortega',
    location: 'Debut Celebration',
    avatar: av3,
    text: "Professional, responsive, and delivered perfection. The attention to detail was unmatched.",
    rating: 5
  },
  {
    id: 4,
    name: 'Sarah Jenkins',
    location: 'Wedding Clients',
    avatar: av1,
    text: 'Most beautiful event I have ever seen. Every detail was absolutely perfect.',
    rating: 5
  },
  {
    id: 5,
    name: 'Daniel Cruz',
    location: 'Corporate Event',
    avatar: av2,
    text: "Outstanding quality and exceptional attention to detail. Highly recommended!",
    rating: 5
  },
  {
    id: 6,
    name: 'Angela Villanueva',
    location: 'Debut Celebration',
    avatar: av3,
    text: "The styling was incredible and exceeded all our expectations for our special day.",
    rating: 5
  },
  {
    id: 7,
    name: 'Alfonso Tolentino',
    location: 'Special Occasion',
    avatar: av1,
    text: "Fantastic attention to detail and smooth execution. Our guests are still talking about it!",
    rating: 5
  },
  {
    id: 8,
    name: 'Rosa Reyes',
    location: 'Wedding Clients',
    avatar: av2,
    text: "Best decision we made. Truly exceptional service and the food was delicious.",
    rating: 5
  },
  {
    id: 9,
    name: 'Victoria Lopez',
    location: 'Debut Celebration',
    avatar: av3,
    text: "Transformed our vision into reality beautifully. Thank you for making it so special.",
    rating: 5
  }
];

interface Review {
  id: number;
  rating: number;
  comment: string;
  first_name?: string;
  last_name?: string;
  customer_name?: string;
  package_name?: string;
  created_at: string;
}

interface ClientTestimonialsProps {
  variant?: 'dark' | 'light';
  packageId?: number;
}

const ClientTestimonials: React.FC<ClientTestimonialsProps> = ({ variant = 'dark', packageId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/reviews/featured?limit=9`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setReviews(data);
          return;
        }
      }
      setReviews([]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageReviews = async (pkgId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/reviews/package/${pkgId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setReviews(data);
          return;
        }
      }
      setReviews([]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Use fetched reviews if available, otherwise use fallback testimonials
  const testimonials = reviews.length > 0 
    ? reviews.map((review, index) => {
        let name = 'Verified Customer';
        if (review.customer_name) {
          name = review.customer_name;
        } else if (review.first_name || review.last_name) {
          name = `${review.first_name || ''} ${review.last_name || ''}`.trim();
        }

        return {
          id: review.id,
          name: name,
          location: review.package_name || 'Verified Customer',
          avatar: [av1, av2, av3][index % 3],
          text: review.comment,
          rating: review.rating
        };
      })
    : FALLBACK_TESTIMONIALS;

  // Show 3 testimonials at a time
  const itemsPerPage = 3;
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerPage);
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - itemsPerPage;
      return newIndex < 0 ? Math.max(0, testimonials.length - itemsPerPage) : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + itemsPerPage;
      return newIndex >= testimonials.length ? 0 : newIndex;
    });
  };

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
          {visibleTestimonials.map((item) => (
            <div key={item.id} className="testimonial-card">
              <div className="card-header">
                <div className="author-meta">
                  <div className="avatar-wrapper initial-avatar">
                    {item.name.charAt(0)}
                  </div>
                  <div className="author-info">
                    <h4>{item.name}</h4>
                    <span className="package-booked">{item.location}</span>
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

        {testimonials.length > itemsPerPage && (
          <div className="testimonials-nav">
            <button className="nav-btn prev" onClick={handlePrev} aria-label="Previous testimonial">
              <ChevronLeft size={20} />
            </button>
            <button className="nav-btn next" onClick={handleNext} aria-label="Next testimonial">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientTestimonials;
