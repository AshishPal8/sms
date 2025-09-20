"use client";
import { SettingsForm } from "@/components/dashboard/settings/settings-form";
import { baseUrl } from "@/config";
import React, { useEffect, useState } from "react";
import useSettingsStore from "@/store/settings";
import api from "@/lib/api";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const updateSettings = useSettingsStore((state) => state.setSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await api.get(`/settings`);

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
