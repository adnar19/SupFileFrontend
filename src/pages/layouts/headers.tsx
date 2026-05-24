import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Headers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="h-screen w-full flex overflow-hidden"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-shrink-0 z-10">
          <Navbar />
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Headers;
