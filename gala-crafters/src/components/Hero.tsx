import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        
        <p className="collection">
          Let's create an unforgettable celebration
        </p>

        <h1>
          The Art of
          <span>Occasion.</span>
        </h1>

        <p className="description">
          We take care of every detail so you can focus on making memories. From small gatherings to big celebrations, we make it happen.
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