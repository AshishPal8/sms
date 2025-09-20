import axios from "axios";
import { baseUrl } from "../config";
import useAuthStore from "@/store/user";
import useSettingsStore from "@/store/settings";

export async function signOut() {
  try {
    await axios.post(
      `${baseUrl}/user/auth/logout`,
      {},
      { withCredentials: true }
    );
  } catch (err) {
    console.error("Server logout failed, still clearing client:", err);
  }

  const authStore = useAuthStore.getState();
  if (typeof authStore.logout === "function") {
    authStore.logout();
  } else {
    authStore.user = null;
    try {
      localStorage.removeItem("user");
    } catch {}
  }

  const settingsStore = useSettingsStore.getState();
  if (typeof settingsStore.clearSettings === "function") {
    settingsStore.clearSettings();
  } else if (typeof settingsStore.setSettings === "function") {
    settingsStore.setSettings(null);
  }

  try {
    localStorage.removeItem("settings-storage");
  } catch {}

  // Broadcast signout across tabs
  try {
    localStorage.setItem("app:signout", String(Date.now()));
  } catch {}

  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
}
