import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-copyright">
            <p>&copy; 2026 SupFile. All rights reserved.</p>
          </div>
          <Link to="/" className="footer-logo">
            <img 
              src="/logo.png" 
              alt="SupFile" 
              className="footer-logo-image"
            />
            <span className="footer-brand-name">SupFile</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;