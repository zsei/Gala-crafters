import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `navbar ${scrolled || !isHome ? 'scrolled' : ''}`;

  return (
    <nav className={navClass}>
      <div className="nav-wrapper">
        <Link to="/" className="logo">
          <div className="diamond"></div>
          GALA CRAFTERS
        </Link>

        <ul className="menu">
          <li><Link to="/events" className="nav-link">EVENTS</Link></li>
          <li className="nav-dropdown">
            <Link to="/services" className="nav-link">SERVICES</Link>
            <div className="dropdown-mega-menu">

              {/* Column 1 */}
              <div className="dropdown-col">
                <Link to="/services/weddings">Weddings</Link>
                <Link to="/corporate" className="nav-link">Corporate</Link>
              </div>

              {/* Column 2 */}
              <div className="dropdown-col">
                <Link to="/debut">Debut</Link>
                <Link to="/services/childrens-party">Children's Party</Link>
              </div>

              {/* Column 3 */}
              <div className="dropdown-col">
                <Link to="/services/special-occasions">Special Occasions</Link>
                <Link to="/services/packages">All Packages</Link>
              </div>

            </div>
          </li>
          <li><Link to="/about" className="nav-link">ABOUT US</Link></li>
          <li><Link to="/contact" className="nav-link">CONTACT US</Link></li>
        </ul>

        <button className="btn-primary">INQUIRE NOW</button>
      </div>
    </nav>
  );
}

export default Navbar;