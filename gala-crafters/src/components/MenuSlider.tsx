import React, { useRef, useState, useEffect } from 'react';
import './MenuSlider.css';
import img1 from '../assets/vintage.jpg';
import img2 from '../assets/blue.jpg';
import img3 from '../assets/pink.jpg';
import img4 from '../assets/img11.jpg';

const originalMenus = [
    { id: 1, title: 'Chefs Special', img: img1 },
    { id: 2, title: 'Signature Plated', img: img2 },
    { id: 3, title: 'International Menu', img: img3 },
    { id: 4, title: 'Traditional Filipino', img: img4 },
    { id: 5, title: 'Kids Menu', img: img1 },
];

// Duplicate the menus to create the infinite scroll illusion
const menus = [...originalMenus, ...originalMenus, ...originalMenus];

const MenuSlider = () => {
    const scrollRef = useRef(null);
    const isScrolling = useRef(false);

    useEffect(() => {
        // Start at the beginning of the second set (the real set)
        if (scrollRef.current) {
            // card width 350 + gap 30 = 380
            // We skip exactly 'originalMenus.length' cards
            scrollRef.current.scrollLeft = 380 * originalMenus.length;
        }
    }, []);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth } = scrollRef.current;
        const cardWidthWithGap = 380;
        const oneSetWidth = originalMenus.length * cardWidthWithGap;

        // If we scrolled into the first cloned set
        if (scrollLeft <= 0) {
            scrollRef.current.scrollLeft = oneSetWidth;
        }
        // If we scrolled deep into the third cloned set
        else if (scrollLeft >= scrollWidth - oneSetWidth - 10) { // -10 buffer
            scrollRef.current.scrollLeft = oneSetWidth;
        }
    };

    const scrollLeftBtn = () => {
        if (scrollRef.current && !isScrolling.current) {
            isScrolling.current = true;
            scrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
            setTimeout(() => isScrolling.current = false, 500); // Prevent spam clicking
        }
    };

    const scrollRightBtn = () => {
        if (scrollRef.current && !isScrolling.current) {
            isScrolling.current = true;
            scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
            setTimeout(() => isScrolling.current = false, 500); // Prevent spam clicking
        }
    };

    return (
        <section className="menu-slider-section">
            <div className="menu-slider-container">

                {/* LEFT TEXT CONTENT */}
                <div className="menu-slider-info">
                    <span className="menu-slider-overline">Our Menus</span>
                    <h2>Gala Crafters's Exquisite Menu Collection</h2>
                    <div className="gold-line" style={{ margin: '20px 0' }}></div>
                    <p>
                        Choose from our Chefs Special, Signature Plated, International Menu, Traditional Filipino, or Kids Menu—each crafted with exceptional care to deliver an unforgettable culinary experience for your celebration.
                    </p>
                    <div className="menu-slider-controls">
                        <button onClick={scrollLeftBtn} aria-label="Scroll left">&larr;</button>
                        <button onClick={scrollRightBtn} aria-label="Scroll right">&rarr;</button>
                    </div>
                </div>

                {/* RIGHT SLIDER */}
                <div className="menu-slider-cards" ref={scrollRef} onScroll={handleScroll}>
                    {menus.map((menu, index) => (
                        <div key={`${menu.id}-${index}`} className="menu-card">
                            <img src={menu.img} alt={menu.title} />
                            <div className="menu-card-overlay">
                                <h3>{menu.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default MenuSlider;
