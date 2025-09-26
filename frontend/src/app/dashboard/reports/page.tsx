"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Reports = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      <Card
        onClick={() => router.push("/dashboard/reports/tickets")}
        className="group w-64 cursor-pointer shadow-sm hover:shadow-md transition-shadow rounded-xl"
      >
        <CardHeader className="flex items-center justify-center pt-4">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center">
            <Ticket size={28} className="text-primary" />
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-2 pb-4">
          <CardTitle className="text-lg font-semibold">
            Ticket Reports
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            View detailed ticket activity
          </p>
          <Button size="sm" variant="outline" className="mt-2">
            Open
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
