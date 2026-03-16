import React from 'react';
/* This is the strict way React requires images to be loaded! */
import sideImage from '../assets/img2.jpg'; 

function Philosophy() {
  return (
    <section className="philosophy-section">
      <div className="container philosophy-container">
        
        {/* Left Side: The Image */}
        <div className="philosophy-image">
          <img src={sideImage} alt="Elegant table setting" />
        </div>

        {/* Right Side: The Text */}
        <div className="philosophy-content">

         <h2>The Architecture of <span>Elegance.</span></h2>          
          <p>
            We believe an event is more than just a gathering—it is a living, breathing piece of art. At Gala Crafters, we meticulously curate every detail, from the ambient lighting to the finest linens, ensuring your occasion is a masterpiece of design.
          </p>
          
          <p>
            Our approach marries timeless sophistication with modern editorial aesthetics, transforming empty spaces into unforgettable experiences.
          </p>

          <div className="signature">
            <p>— The Gala Crafters Team</p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Philosophy;