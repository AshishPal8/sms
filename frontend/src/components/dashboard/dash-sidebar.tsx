import React from "react";
import Logo from "../layout/logo";
import SidebarLinks from "./sidebar-links";

const DashSidebar = () => {
  return (
    <div className="md:w-full h-screen bg-white p-5">
      <div className="hidden md:block">
        <Logo />
      </div>
      <SidebarLinks />
    </div>
  );
};

export default DashSidebar;
