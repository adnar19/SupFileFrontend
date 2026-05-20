import { HardDrive, File, Star, Trash2, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { formatFileSize } from "../../utils/fileUtils";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, refreshUser } = useAuth();
  
  const storageUsed = user?.storageUsed ? parseInt(user.storageUsed) : 0;
  const storageTotal = user?.storageQuota ? parseInt(user.storageQuota) : 1;

  useEffect(() => {
    const handleStorageUpdate = () => refreshUser();
    window.addEventListener('storage-updated', handleStorageUpdate);
    return () => window.removeEventListener('storage-updated', handleStorageUpdate);
  }, []);

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <HardDrive className="w-5 h-5" />,
      label: "My Drive",
      path: "/my-drive",
    },
    {
      icon: <File className="w-5 h-5" />,
      label: "All Files",
      path: "/all-files",
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Favorites",
      path: "/favorites",
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      label: "Trash",
      path: "/trash",
    },
  ];
  return (
    <div
      className="w-64 p-6 flex-shrink-0 h-full overflow-y-auto"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      <div className="space-y-6">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="SupFile" className="w-8 h-8" />
          <span className="text-xl font-bold">SupFile</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: isActive
                    ? "rgba(59, 130, 246, 0.1)"
                    : "transparent",
                  color: isActive
                    ? "var(--accent-color)"
                    : "var(--text-secondary)",
                }}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Storage Indicator */}
        <div
          className="rounded-2xl p-4 border"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <HardDrive
              className="w-4 h-4"
              style={{ color: "var(--text-tertiary)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Storage
            </span>
          </div>
          <div className="space-y-2">
            <div
              className="flex justify-between text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              <span>{formatFileSize(storageUsed)} used</span>
              <span>{formatFileSize(storageTotal)} total</span>
            </div>
            <div
              className="w-full rounded-full h-2 overflow-hidden shadow-inner flex"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
                <div
                  className="bg-blue-500 h-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${storageUsed > 0 ? Math.max((storageUsed / storageTotal) * 100, 0.5) : 0}%` 
                  }}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
