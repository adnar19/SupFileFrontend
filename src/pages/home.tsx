import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Folder,
  Share2,
  Globe,
  User,
  Sun,
  Moon,
} from "lucide-react";
import Footer from "./layouts/footer";
import { useTheme } from "../contexts/ThemeContext";

const Home: React.FC = () => {
  const features = [
    {
      title: "Secure File Storage",
      description:
        "Your files are encrypted and protected with enterprise-grade security.",
      icon: <ShieldCheck size={32} className="text-blue-500" />,
    },
    {
      title: "File and Folder Organization",
      description: "Organize your files with an intuitive folder structure.",
      icon: <Folder size={32} className="text-blue-500" />,
    },
    {
      title: "Easy File Sharing",
      description: "Share files and folders securely.",
      icon: <Share2 size={32} className="text-blue-500" />,
    },
    {
      title: "Access Anywhere",
      description: "Access your files from any device.",
      icon: <Globe size={32} className="text-blue-500" />,
    },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] transition-colors duration-300">
      <nav className="bg-[var(--navbar-bg)] shadow-[0_2px_10px_var(--shadow-color)] sticky top-0 z-[100] w-full transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 sm:px-6 sm:py-4 max-w-[1200px] mx-auto w-full gap-3 sm:gap-0">
          {/* Logo */}
          <Link
            to="/home"
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
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
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

      <main className="flex-1 w-full py-[clamp(40px,8vw,80px)]">
        {/* Hero Section */}
        <section className="text-center mb-[clamp(60px,10vw,100px)] px-[clamp(20px,4vw,40px)]">
          <div className="max-w-[800px] mx-auto">
            <h1 className="text-[clamp(32px,6vw,56px)] font-bold text-[var(--text-primary)] leading-tight mb-[clamp(20px,4vw,30px)] transition-colors">
              Secure Cloud Storage For All Your Files.
            </h1>

            <p className="text-[clamp(16px,3vw,20px)] text-[var(--text-secondary)] max-w-[600px] mx-auto mb-[clamp(30px,5vw,40px)] leading-relaxed transition-colors">
              Store, share, and organize your digital life seamlessly from
              anywhere. Access your documents, photos, and videos on any device
              with SupFile.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-[clamp(16px,3vw,24px)]">
              <Link
                to="/register"
                className="bg-[var(--accent-color)] text-white font-semibold
                       text-[clamp(16px,3vw,20px)]
                       px-[clamp(32px,6vw,48px)]
                       py-[clamp(14px,3vw,18px)]
                       rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.3)]
                       transition-all duration-300
                       hover:-translate-y-0.5
                       hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)]
                       hover:bg-[var(--accent-hover)]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="grid gap-[clamp(20px,3vw,40px)]
                 px-[clamp(20px,4vw,40px)]
                 grid-cols-1
                 sm:grid-cols-2
                 lg:grid-cols-3
                 xl:grid-cols-4"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[var(--card-bg)]
                     border border-[var(--border-color)]
                     rounded-2xl
                     p-[clamp(24px,3vw,40px)]
                     min-h-[320px]
                     flex flex-col justify-between
                     text-center
                     shadow-[0_10px_30px_var(--shadow-color)]
                     transition-all duration-300
                     hover:-translate-y-1
                     hover:border-[var(--accent-color)]
                     hover:shadow-[0_20px_40px_var(--shadow-color)]"
            >
              <div
                className="mx-auto mb-[clamp(16px,3vw,24px)]
                       flex items-center justify-center
                       w-[clamp(50px,8vw,70px)]
                       h-[clamp(50px,8vw,70px)]
                       rounded-full
                       bg-[rgba(59,130,246,0.1)]
                       transition-all duration-300
                       group-hover:scale-105"
              >
                {feature.icon}
              </div>

              <h3 className="text-[clamp(16px,2.5vw,20px)] font-semibold text-[var(--text-primary)] mb-[clamp(10px,2vw,16px)] transition-colors">
                {feature.title}
              </h3>

              <p className="text-[clamp(13px,2vw,15px)] text-[var(--text-secondary)] leading-relaxed transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
