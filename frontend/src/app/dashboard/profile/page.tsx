"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Role } from "@/types/role.types";
import { baseUrl } from "../../../config";
import { ProfileForm } from "@/components/dashboard/profile/profile-form";
import EmployeeProfileCard from "@/components/dashboard/profile/profile-card";

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get(`${baseUrl}/employees/me`, {
        withCredentials: true,
      });

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
