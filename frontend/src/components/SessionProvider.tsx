"use client";
import { useSessionHeartbeat } from "@/lib/sessionHeartbeat";
import { ReactNode } from "react";

export function SessionProvider({ children }: { children: ReactNode }) {
  useSessionHeartbeat();
  return <>{children}</>;
}
