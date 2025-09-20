"use client";
import { SettingsForm } from "@/components/dashboard/settings/settings-form";
import { baseUrl } from "@/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useSettingsStore from "@/store/settings";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const updateSettings = useSettingsStore((state) => state.setSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await axios.get(`${baseUrl}/settings`, {
        withCredentials: true,
      });

      const { data } = res.data;

      setSettings(data);
      updateSettings(data);
    };

    fetchSettings();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <SettingsForm initialData={settings} />
    </div>
  );
};

export default Settings;
