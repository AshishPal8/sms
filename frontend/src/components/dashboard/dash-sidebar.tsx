import React from "react";
import Logo from "../layout/logo";
import SidebarLinks from "./sidebar-links";

const DashSidebar = () => {
  return (
    <div className="fixed left-0 top-0 md:w-1/5 h-screen bg-white p-5 z-40 overflow-y-auto">
      <div className="hidden md:block">
        <Logo />
      </div>
      <SidebarLinks />
    </div>
  );
};

export default DashSidebar;
