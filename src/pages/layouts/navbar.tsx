import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FolderPlus, LogOut, Moon, Sun, Upload, User, File as FileIcon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Logout } from "../../services/auth";
import useAuth from "../../hooks/useAuth";
import { useFileSystem } from "../../contexts/FileSystemContext";
import { createFolder } from "../../services/folder";
import { uploadFile } from "../../services/file";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";
import { PreviewModal } from "../../components/PreviewModal";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [itemToPreview] = useState<{
    id: string;
    name: string;
    type: "file" | "folder";
  } | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
      case "/dashboard":
        return "Dashboard";
      case "/my-drive":
        return "My Drive";
      case "/all-files":
        return "All Files";
      case "/favorites":
        return "Favorites";
      case "/trash":
        return "Trash";
      case "/shared-with-me":
        return "Sharing Management";
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

  const {
    currentFolderId,
    setCurrentFolderId,
    currentFolderName,
    setCurrentFolderName,
    triggerRefresh,
  } = useFileSystem();

  const handleCreateFolder = () => {
    setNewFolderName("");
    setIsCreateModalOpen(true);
  };

  const confirmCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName || newFolderName.trim() === "") return;

    const isDrivePage = location.pathname === "/my-drive" || location.pathname.startsWith("/folder/");
    const parentId = isDrivePage ? (currentFolderId || 'root') : 'root';

    try {
      setIsCreating(true);
      const res = await createFolder(newFolderName, parentId);
      if (res && res.success && res.data) {
        toast.success("Folder created successfully");
        if (!isDrivePage) {
          setCurrentFolderId(undefined);
          setCurrentFolderName("My Files");
          navigate("/my-drive");
        }
        triggerRefresh();
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to create folder");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUploadClick = () => {
    setSelectedFile(null);
    setIsUploadModalOpen(true);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const confirmUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulation de progression (à remplacer par la vraie progression via Axios)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 200);

      const isDrivePage = location.pathname === "/my-drive" || location.pathname.startsWith("/folder/");
      const parentId = isDrivePage ? (currentFolderId || "root") : "root";

      const res = await uploadFile(selectedFile, parentId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res && res.success) {
        toast.success("File uploaded successfully");
        if (!isDrivePage) {
          setCurrentFolderId(undefined);
          setCurrentFolderName("My Files");
          navigate("/my-drive");
        }
        triggerRefresh();
        window.dispatchEvent(new Event("storage-updated"));
        setIsUploadModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
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

  const isActionPage = !["/trash", "/account-settings", "/shared-with-me"].includes(
    location.pathname,
  );

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
            {location.pathname.startsWith("/folder/") && currentFolderName
              ? currentFolderName
              : getPageTitle(location.pathname)}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {isActionPage && (
            <>
              {/* Upload Button */}
              <button
                onClick={handleUploadClick}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
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
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
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
                  <div
                    className="px-4 py-2 border-b"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {user.fullName}
                    </p>
                    <p
                      className="text-[10px] truncate"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {user.email}
                    </p>
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
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
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
              style={{
                color: "var(--text-secondary)",
                backgroundColor: "transparent",
              }}
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

      {/* Upload File Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload File"
      >
        <form onSubmit={confirmUpload} className="space-y-4">
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all relative ${
              isDragging 
                ? "border-blue-500 bg-blue-500/5" 
                : "border-[var(--border-color)] hover:bg-[var(--bg-tertiary)]"
            } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {selectedFile ? (
              <FileIcon className="w-10 h-10 text-blue-500" />
            ) : (
              <Upload className={`w-10 h-10 ${isDragging ? "text-blue-500 animate-bounce" : "text-blue-500"}`} />
            )}
            <div className="text-center">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {selectedFile ? selectedFile.name : "Click or drag file here"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : "Supports all file types"}
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: "var(--text-secondary)",
                backgroundColor: "transparent",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </form>
      </Modal>

      {/* File Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        file={itemToPreview}
      />
    </header>
  );
};

export default Navbar;
