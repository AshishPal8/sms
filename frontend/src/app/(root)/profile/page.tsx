import { ProfileHeader } from "@/components/profile/profile-header";
import TicketsSection from "@/components/profile/tickets-section";
import React from "react";

const ProfilePage = () => {
  return (
    <div className="max-w-6xl mx-auto pt-10">
      <ProfileHeader />
      <TicketsSection />
    </div>
  );
};

export default ProfilePage;
