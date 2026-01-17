import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img 
            src="/logo.png" 
            alt="SupFile" 
            className="logo-image"
          />
          <span className="brand-name">SupFile</span>
        </Link>
        
        <div className="nav-controls">
          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Profile Dropdown */}
          <div className="profile-dropdown" ref={dropdownRef}>
            <button 
              className="profile-button"
              onClick={toggleDropdown}
              aria-label="Profile menu"
              aria-expanded={isDropdownOpen}
            >
              <User size={20} />
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/signin" className="dropdown-item">
                  Sign In
                </Link>
                <Link to="/signup" className="dropdown-item">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;