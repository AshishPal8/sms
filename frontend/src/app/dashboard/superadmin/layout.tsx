// import { RoleProtected } from "@/components/dashboard/role-protected";
// import { roles } from "@/lib/utils";
import React from "react";
export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
