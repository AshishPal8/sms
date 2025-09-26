import React, { useEffect } from "react";
import Logo from "../layout/logo";
import SidebarLinks from "./sidebar-links";
import { X } from "lucide-react";

interface DashMobileSidebarProps {
  setSidebarOpen: (open: boolean) => void;
  open: boolean;
}

const DashMobileSidebar: React.FC<DashMobileSidebarProps> = ({
  setSidebarOpen,
  open,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Sidebar */}
      <div className="w-3/4 h-full bg-white p-5 relative shadow-lg">
        <div className="flex justify-center items-center mb-6">
          <Logo />
          <button
            className="absolute top-2 right-2"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <SidebarLinks setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Overlay */}
      <div
        className="flex-1 bg-black/40" // 40% opacity black
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  );
};

export default DashMobileSidebar;
