import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import useAuth from "../../hooks/useAuth";
import { useFileSystem } from "../../contexts/FileSystemContext";
import { createFolder } from "../../services/folder";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
      case "/dashboard":
        return "All Files";
      case "/recent":
        return "Recent";
      case "/favorites":
        return "Favorites";
      case "/trash":
        return "Trash";
      case "/account-settings":
        return "Account Settings";
      default:
        return "SupFile";
    }
  };

  const handleLogout = async () => {
    await Logout();
    window.location.href = "/login";
  };

  const { currentFolderId, setCurrentFolderId, currentFolderName, setCurrentFolderName, triggerRefresh } = useFileSystem();

  const handleCreateFolder = () => {
    setNewFolderName("");
    setIsCreateModalOpen(true);
  };

  const confirmCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName || newFolderName.trim() === "") return;

    try {
      setIsCreating(true);
      const res = await createFolder(newFolderName, currentFolderId);
      if (res && res.success && res.data) {
        toast.success("Folder created successfully");
        setCurrentFolderId(res.data.id);
        setCurrentFolderName(res.data.name); // Update name immediately
        triggerRefresh();
        setIsCreateModalOpen(false);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to create folder");
    } finally {
      setIsCreating(false);
    }
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

  const isActionPage = !["/trash", "/account-settings"].includes(location.pathname);

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
          <h1 className="text-2xl font-bold">
            {currentFolderName || getPageTitle(location.pathname)}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {isActionPage && (
            <>
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-tertiary)" }}
                />
                <input
                  type="text"
                  placeholder="Search files..."
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
                onClick={handleCreateFolder}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                }}
              >
                <FolderPlus className="w-4 h-4" />
                <span className="text-sm font-medium">New Folder</span>
              </button>
            </>
          )}

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
               className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors overflow-hidden border border-[var(--border-color)]"
               style={{
                 backgroundColor: "var(--bg-tertiary)",
                 color: "var(--text-primary)",
               }}
               aria-expanded={showAccountMenu}
             >
               {user?.avatar ? (
                 <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User className="w-5 h-5" />
               )}
             </button>

            {showAccountMenu && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-2 z-50"
                 style={{
                   backgroundColor: "var(--card-bg)",
                   borderColor: "var(--border-color)",
                 }}
               >
                 {user && (
                   <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                     <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.fullName}</p>
                     <p className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>{user.email}</p>
                   </div>
                 )}
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

      {/* Create Folder Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title="Create New Folder"
      >
        <form onSubmit={confirmCreateFolder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Folder Name
            </label>
            <input
              autoFocus
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name..."
              className="w-full px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: "var(--text-secondary)", backgroundColor: "transparent" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !newFolderName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isCreating ? "Creating..." : "Create Folder"}
            </button>
          </div>
        </form>
      </Modal>
    </header>
  );
};

export default Navbar;
