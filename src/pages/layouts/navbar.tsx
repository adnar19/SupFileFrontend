import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FolderPlus,
  LogOut,
  Moon,
  Search,
  Sun,
  Upload,
  User,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Logout } from "../../services/auth";

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await Logout();
    window.location.href = "/login";
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="px-6 py-4"
      style={{
        backgroundColor: "var(--navbar-bg)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Favorite Files</h1>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--text-tertiary)" }}
            />
            <input
              type="text"
              placeholder="Search favorite files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Upload Button */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload</span>
          </button>

          {/* New Folder Button */}
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
            }}
          >
            <FolderPlus className="w-4 h-4" />
            <span className="text-sm font-medium">New Folder</span>
          </button>

          {/* Theme Toggle */}
          <button
            className="bg-transparent border rounded-lg p-1.5 cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
            }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
              aria-expanded={showAccountMenu}
            >
              <User className="w-5 h-5" />
            </button>

            {showAccountMenu && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-2 z-50"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <Link
                  to="/account-settings"
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
