"use client";
import useAuthStore from "@/store/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleProtectedProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function RoleProtected({ allowedRoles, children }: RoleProtectedProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [user, allowedRoles, router]);

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
