import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import Navbar from '../../layouts/navbar';
import Footer from '../../layouts/footer';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Navbar />
      
      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Secure Cloud Storage For All Your Files.</h1>
            <p className="hero-subtitle">
              Store, share, and organize your digital life seamlessly from anywhere. Access your documents, photos, and videos on any device with SupFile.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="hero-btn primary">Get Started</Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="#3B82F6" strokeWidth="2" fill="none"/>
                <path d="M9 12L11 14L15 10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Secure File Storage</h3>
            <p className="feature-description">
              Your files are encrypted and protected with enterprise-grade security measures.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M3 7V5C3 3.89543 3.89543 3 5 3H9L11 5H15C16.1046 5 17 5.89543 17 7V19C17 20.1046 16.1046 21 15 21H5C3.89543 21 3 20.1046 3 19V7Z" stroke="#3B82F6" strokeWidth="2" fill="none"/>
                <path d="M7 11H13" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 15H13" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="feature-title">File and Folder Organization</h3>
            <p className="feature-description">
              Organize your files with an intuitive folder structure and easy navigation.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="3" stroke="#3B82F6" strokeWidth="2" fill="none"/>
                <circle cx="6" cy="12" r="3" stroke="#3B82F6" strokeWidth="2" fill="none"/>
                <circle cx="18" cy="19" r="3" stroke="#3B82F6" strokeWidth="2" fill="none"/>
                <path d="M8.59 13.51L15.42 17.49" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                <path d="M15.41 6.51L8.59 10.49" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Easy File Sharing</h3>
            <p className="feature-description">
              Share files and folders with anyone using secure, controlled access links.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2" fill="none"/>
                <path d="M2 12H22" stroke="#3B82F6" strokeWidth="2"/>
                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="#3B82F6" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="feature-title">Access Anywhere</h3>
            <p className="feature-description">
              Access your files from any device web, mobile, or tablet anytime, anywhere.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;