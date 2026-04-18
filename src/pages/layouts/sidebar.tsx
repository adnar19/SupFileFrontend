import { HardDrive, File, Clock, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const storageUsed = 45.7;
  const storageTotal = 100;
  const sidebarItems = [
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Recent",
      active: false,
      path: "/recent",
    },
    {
      icon: <File className="w-5 h-5" />,
      label: "All Files",
      active: false,
      path: "/dashboard",
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Favorites",
      active: true,
      path: "/favorites",
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      label: "Trash",
      active: false,
      path: "/trash",
    },
  ];
  return (
    <div
      className="w-64 p-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      <div className="space-y-6">
        {/* Logo */}
        <Link
          to="/file-manager"
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="SupFile" className="w-8 h-8" />
          <span className="text-xl font-bold">SupFile</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: item.active
                  ? "rgba(59, 130, 246, 0.1)"
                  : "transparent",
                color: item.active
                  ? "var(--accent-color)"
                  : "var(--text-secondary)",
              }}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Storage Indicator */}
        <div
          className="rounded-lg p-4 border"
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
              <span>{storageUsed} GB used</span>
              <span>{storageTotal} GB total</span>
            </div>
            <div
              className="w-full rounded-full h-2"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
