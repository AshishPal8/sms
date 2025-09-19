// app/dashboard/tree/page.tsx
import React from "react";
import dynamic from "next/dynamic";
import { Heading } from "@/components/ui/heading";

// Dynamically import the client-only OrgTree component (no SSR)
const OrgTreeClient = dynamic(
  () => import("@/components/dashboard/tree/org-tree-client"),
  {
    ssr: true,
  }
);

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Heading
          title="Organizational Chart"
          description="Centered vertical tree with connectors. Click nodes to collapse/expand."
        />

        {/* Client-only chart loaded dynamically */}
        <div className="mt-4">
          <OrgTreeClient />
        </div>
      </div>
    </div>
  );
}
