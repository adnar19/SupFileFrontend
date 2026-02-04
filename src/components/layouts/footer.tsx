import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
       <footer className="bg-[var(--navbar-bg)] border-t border-[var(--border-color)] shadow-[0_-2px_10px_var(--shadow-color)] w-full transition-all duration-300">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center px-5 py-5 sm:px-8 sm:py-6 md:px-10 md:py-7 gap-4 md:gap-5 relative">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 md:mr-auto no-underline transition-transform duration-200 hover:scale-[1.02]"
          >
            <img 
              src="/logo.png" 
              alt="SupFile" 
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md object-cover"
            />
            <span className="text-base sm:text-lg md:text-xl font-semibold text-[var(--text-primary)] whitespace-nowrap transition-colors duration-300">
              SupFile
            </span>
          </Link>

          {/* Copyright */}
          <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
            <p className="m-0 text-xs sm:text-sm text-center transition-colors duration-300">
              &copy; 2026 SupFile. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;