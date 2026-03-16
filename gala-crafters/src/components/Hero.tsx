import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        
        <p className="collection">
          THE 2024 COLLECTION
        </p>

        <h1>
          The Art of
          <span>Occasion.</span>
        </h1>

        <p className="description">
          Redefining event architecture through a lens of curated sophistication.
          We believe every gathering is a blank canvas for editorial mastery.
        </p>

        <div className="buttons">
          <button className="btn-primary">
            View Collections
          </button>

          <button className="btn-outline">
            The Philosophy
          </button>
        </div>

      </div>
    </section>
  );
}

export default Hero;