import React from 'react';
import { motion } from 'framer-motion';

const LocationsSection: React.FC = () => {
    const locations = [
        {
            title: 'Metro Manila',
            description: 'From Manila to Quezon City and Las Piñas, Gala Crafters brings unforgettable moments to every corner of Metro Manila. With renowned styling and award-winning cuisine, our tailored services promise an unforgettable experience.'
        },
        {
            title: 'Greater Manila',
            description: 'Venturing beyond Metro Manila, our catering services gracefully reach the picturesque locales of Batangas and Laguna. These cities, just a stone\'s throw away, offer idyllic settings for outdoor venues and delightful experiences.'
        },
        {
            title: 'Cavite',
            description: 'Delight in Gala Crafters\'s culinary expertise amidst Cavite\'s rich history, featuring the picturesque scenery of Tagaytay. Our services now reach this province, celebrated for its cultural heritage and natural beauty.'
        }
    ];

    return (
        <section className="locations-section">
            <div className="locations-container">
                <motion.div 
                    className="locations-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Locations We Work With</h2>
                    <div className="gold-line"></div>
                    <p className="locations-subtitle">
                        Gala Crafters travels across the Philippines to bring premium catering and styling to your chosen venue.
                    </p>
                </motion.div>

                <div className="locations-grid">
                    {locations.map((loc, index) => (
                        <motion.div 
                            key={index}
                            className="location-card"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <h3 className="location-title">{loc.title}</h3>
                            <p className="location-description">{loc.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocationsSection;
