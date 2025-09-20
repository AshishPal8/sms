// src/lib/sessionHeartbeat.ts
"use client";

import { useEffect } from "react";
import { signOut } from "@/lib/signOut";
import useAuthStore from "@/store/user";
import { roles } from "./utils";

const HEARTBEAT_KEY = "app:lastSeen";
const HEARTBEAT_INTERVAL_MS = 10_000;
const CLOSE_MARKER_KEY = "app:tabClosedAt";
const GRACE_AFTER_CLOSE_MS = 10 * 60 * 1000;

export function useSessionHeartbeat() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || user.role === roles.CUSTOMER) return;

    // helper to write lastSeen
    const writeHeartbeat = () => {
      try {
        localStorage.setItem(HEARTBEAT_KEY, String(Date.now()));
      } catch {}
    };

    // initial check on mount
    try {
      const lastSeenRaw = localStorage.getItem(HEARTBEAT_KEY);
      const lastSeen = lastSeenRaw ? Number(lastSeenRaw) : 0;
      const closedAtRaw = localStorage.getItem(CLOSE_MARKER_KEY);
      const closedAt = closedAtRaw ? Number(closedAtRaw) : 0;

      // If there is a closedAt marker and we are after grace period -> logout
      if (closedAt && Date.now() - closedAt > GRACE_AFTER_CLOSE_MS) {
        // Someone closed tabs > 10min ago -> enforce signout
        signOut();
        return;
      }

      // If no closedAt but lastSeen older than grace -> signout
      if (lastSeen && Date.now() - lastSeen > GRACE_AFTER_CLOSE_MS) {
        signOut();
        return;
      }
    } catch (e) {
      // ignore
    }

    // start heartbeat
    writeHeartbeat();
    const intervalId = window.setInterval(
      writeHeartbeat,
      HEARTBEAT_INTERVAL_MS
    );

    // on unload, mark close time
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem(CLOSE_MARKER_KEY, String(Date.now()));
      } catch {}
    };

    // when tab becomes visible again, remove close marker
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        try {
          localStorage.removeItem(CLOSE_MARKER_KEY);
        } catch {}
        writeHeartbeat();
      } else {
        // optionally mark closed when hidden (but hidden != closed)
        try {
          localStorage.setItem(CLOSE_MARKER_KEY, String(Date.now()));
        } catch {}
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // listen for signout from other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === "app:signout") {
        // another tab signed out -> sign out here too
        signOut();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [user]);
}
