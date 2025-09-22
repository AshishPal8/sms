"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Image from "next/image";

type Technician = {
  id: string;
  firstname: string;
  lastname?: string | null;
  email?: string | null;
  profilePicture?: string | null;
  role?: string;
  isActive?: boolean;
};

type ManagerWithTechs = {
  manager: {
    id: string;
    firstname: string;
    lastname?: string | null;
    email?: string | null;
    profilePicture?: string | null;
    role?: string;
    isActive?: boolean;
  };
  assignedAt?: string;
  technicians: Technician[];
  technicianCount: number;
};

type DeptResponse = {
  department: { id: string; name: string };
  managers: ManagerWithTechs[];
  unassignedTechnicians?: Technician[];
  totalManagers?: number;
  totalTechnicians?: number;
};

export default function DepEmployees() {
  const { depId } = useParams();
  const [data, setData] = useState<DeptResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!depId) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchDepartments = async () => {
      try {
        const res = await api.get(`/departments/employees/${depId}`);
        const payload = res?.data?.data as DeptResponse | undefined;
        if (mounted) {
          if (!payload) {
            setError("No data returned from server.");
            setData(null);
          } else {
            setData(payload);
          }
        }
      } catch (err) {
        console.error("Error fetching department employees:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDepartments();

    return () => {
      mounted = false;
    };
  }, [depId]);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading department employees…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p>No department data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {data.department?.name || "Department"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.totalManagers ?? data.managers.length} manager
            {(data.totalManagers ?? data.managers.length) !== 1
              ? "s"
              : ""} ·{" "}
            {data.totalTechnicians ??
              data.managers.reduce(
                (s, m) => s + (m.technicianCount || 0),
                0
              )}{" "}
            technician
            {(data.totalTechnicians ??
              data.managers.reduce(
                (s, m) => s + (m.technicianCount || 0),
                0
              )) !== 1
              ? "s"
              : ""}
          </p>
        </div>
      </div>

      {/* Managers list */}
      <div className="space-y-4">
        {data.managers.map((mwr) => (
          <div
            key={mwr.manager.id}
            className="border rounded-lg p-4 bg-white/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={mwr.manager.profilePicture || "/default.webp"}
                  alt={`${mwr.manager.firstname} avatar`}
                  className="w-12 h-12 rounded-full object-cover"
                  width={50}
                  height={50}
                />
                <div>
                  <div className="font-medium">
                    {mwr.manager.firstname}{" "}
                    {mwr.manager.lastname ? mwr.manager.lastname : ""}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mwr.manager.email}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {mwr.manager.role}
                </div>
                <div className="text-sm">
                  Technicians: {mwr.technicianCount}
                </div>
              </div>
            </div>

            {/* Technicians under manager */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mwr.technicians.length ? (
                mwr.technicians.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 border rounded-md p-3 bg-white/3"
                  >
                    <Image
                      src={t.profilePicture || "/default.webp"}
                      alt={`${t.firstname} avatar`}
                      className="w-10 h-10 rounded-full object-cover"
                      width={50}
                      height={50}
                    />
                    <div>
                      <div className="font-medium">
                        {t.firstname} {t.lastname ?? ""}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t.email}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No technicians assigned to this manager.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
