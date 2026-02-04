import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext'; 

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ferme le dropdown quand on clique en dehors
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
    <nav className="bg-[var(--navbar-bg)] shadow-[0_2px_10px_var(--shadow-color)] sticky top-0 z-[100] w-full transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 sm:px-6 sm:py-4 max-w-[1200px] mx-auto w-full gap-3 sm:gap-0">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 no-underline transition-transform duration-200 hover:scale-[1.02]"
        >
          <img 
            src="/logo.png" 
            alt="SupFile" 
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg object-cover"
          />
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-primary)] whitespace-nowrap transition-colors duration-300">
            SupFile
          </span>
        </Link>
        
        {/* Contrôles de navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Bouton de changement de thème */}
          <button 
            className="bg-transparent border border-[var(--border-color)] rounded-lg p-1.5 sm:p-2 cursor-pointer flex items-center justify-center transition-all duration-200 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] hover:-translate-y-0.5 active:translate-y-0"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Menu déroulant de profil */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="bg-transparent border border-[var(--border-color)] rounded-lg p-1.5 sm:p-2 cursor-pointer flex items-center justify-center transition-all duration-200 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] hover:-translate-y-0.5 active:translate-y-0"
              onClick={toggleDropdown}
              aria-label="Profile menu"
              aria-expanded={isDropdownOpen}
            >
              <User size={20} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 sm:right-0 -right-12 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-[0_4px_20px_var(--shadow-color)] min-w-[120px] sm:min-w-[150px] z-[1000] overflow-hidden animate-[dropdownSlide_0.2s_ease]">
                <Link 
                  to="/login" 
                  className="block px-4 py-3 text-[var(--text-primary)] no-underline text-sm font-medium transition-all duration-200 border-b border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent-color)]"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="block px-4 py-3 text-[var(--text-primary)] no-underline text-sm font-medium transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent-color)]"
                >
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