import React from "react";
import Logo from "../layout/logo";
import SidebarLinks from "./sidebar-links";
import { X } from "lucide-react";

interface DashMobileSidebarProps {
  setSidebarOpen: (open: boolean) => void;
}

const DashMobileSidebar: React.FC<DashMobileSidebarProps> = ({
  setSidebarOpen,
}) => {
  return (
    <div className="w-full h-screen bg-white p-5 relative">
      <div className="flex justify-center items-center mb-6">
        <Logo />
        <button
          className="absolute top-2 right-2"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={24} />
        </button>
      </div>
      <SidebarLinks />
    </div>
  );
};

export default DashMobileSidebar;
