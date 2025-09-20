"use client";

import { useEffect, useState } from "react";
import { ProfileForm } from "@/components/dashboard/profile/profile-form";
import EmployeeProfileCard from "@/components/dashboard/profile/profile-card";
import api from "@/lib/api";

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get(`/employees/me`);

      const { data } = res.data;

      setProfile(data);
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EmployeeProfileCard data={profile} />
        <ProfileForm initialData={profile} />
      </div>
    </div>
  );
}

export default ProfilePage;
