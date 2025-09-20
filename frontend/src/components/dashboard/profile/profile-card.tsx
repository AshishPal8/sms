"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useSettingsStore from "@/store/settings";

type Person = {
  id: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  profilePicture?: string | null;
  role?: string;
  phone?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type Technician = {
  id: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  profilePicture?: string | null;
  role?: string;
};

type DepartmentWithDivision = {
  id: string;
  name: string;
  division?: { id: string; name: string } | null;
};

type EmployeeData = {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  role?: string;
  phone?: string | null;
  isActive?: boolean;
  profilePicture?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;

  // manager branch
  manager?: Person | null;

  // technician branch
  department?: { id: string; name: string } | null;
  division?: { id: string; name: string } | null;

  // manager branch
  departments?: DepartmentWithDivision[] | null;
  technicians?: Technician[] | null;

  // assistant branch
  superadmin?: Person | null;
};

const fallback = "/default.webp";

function Name({
  firstname,
  lastname,
}: {
  firstname?: string;
  lastname?: string;
}) {
  const name = `${firstname ?? ""} ${lastname ?? ""}`.trim();
  return <div className="text-lg font-semibold">{name || "—"}</div>;
}

function SmallMeta({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="text-sm text-gray-500">
      <span className="font-medium text-gray-700">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

export default function EmployeeProfileCard({ data }: { data: EmployeeData }) {
  const dateFormat = useSettingsStore((s) => s.getDateFormat());

  if (!data) return null;

  const name = `${data.firstname ?? ""} ${data.lastname ?? ""}`.trim();
  const created = data.createdAt
    ? format(new Date(data.createdAt), dateFormat)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-2 gap-4">
        <Link
          href="/dashboard"
          className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"
        >
          <ArrowLeft size={25} />
        </Link>
        <Heading title="Profile" description="Update profile details" />
      </div>
      <Separator />
      {/* PROFILE CARD */}
      <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-28 h-28 relative flex-shrink-0">
          <Image
            src={data.profilePicture || fallback}
            alt={name || data.email || "Profile"}
            fill
            sizes="112px"
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Name firstname={data.firstname} lastname={data.lastname} />
              <div className="text-sm text-muted-foreground capitalize">
                {data.role ?? "—"}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Status</div>
              <div
                className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  data.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {data.isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <SmallMeta label="Email" value={data.email ?? undefined} />
            <SmallMeta label="Phone" value={data.phone ?? undefined} />
            {created && <SmallMeta label="Joined" value={created} />}
          </div>
        </div>
      </div>

      {/* ROLE SPECIFIC */}
      {/* TECHNICIAN: show manager, department, division */}
      {data.role?.toUpperCase() === "TECHNICIAN" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold mb-3">Manager</h3>
            {data.manager ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 relative rounded-full overflow-hidden">
                  <Image
                    src={data.manager.profilePicture || fallback}
                    alt={data.manager.firstname ?? "Manager"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">
                    {`${data.manager.firstname ?? ""} ${
                      data.manager.lastname ?? ""
                    }`.trim()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {data.manager.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No manager found</div>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold mb-3">Department</h3>
            {data.department ? (
              <div className="text-sm text-gray-700">
                {data.department.name}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No department assigned
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold mb-3">Division</h3>
            {data.division ? (
              <div className="text-sm text-gray-700">{data.division.name}</div>
            ) : (
              <div className="text-sm text-gray-500">No division found</div>
            )}
          </div>
        </div>
      )}

      {/* MANAGER: show departments (with division) and technicians */}
      {data.role?.toUpperCase() === "MANAGER" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold mb-3">Managed Departments</h3>
            {data.departments && data.departments.length ? (
              <ul className="space-y-2">
                {data.departments.map((d: DepartmentWithDivision) => (
                  <li
                    key={d.id}
                    className="flex items-start justify-between gap-3 p-2 rounded hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500">
                        Division: {d.division?.name ?? "—"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">
                No managed departments
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold mb-3">Technicians</h3>
            {data.technicians && data.technicians.length ? (
              <ul className="space-y-2">
                {data.technicians.map((t: Technician) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 relative rounded-full overflow-hidden">
                      <Image
                        src={t.profilePicture || fallback}
                        alt={t.firstname ?? t.name ?? "Tech"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">
                        {t.firstname
                          ? `${t.firstname} ${t.lastname ?? ""}`.trim()
                          : t.name}
                      </div>
                      <div className="text-xs text-gray-500">{t.email}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">No technicians</div>
            )}
          </div>
        </div>
      )}

      {/* ASSISTANT: show superadmin card */}
      {data.role?.toUpperCase() === "ASSISTANT" && data.superadmin && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold mb-3">Superadmin</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative rounded-full overflow-hidden">
              <Image
                src={data.superadmin.profilePicture || fallback}
                alt={data.superadmin.firstname || ""}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium">
                {`${data.superadmin.firstname ?? ""} ${
                  data.superadmin.lastname ?? ""
                }`.trim()}
              </div>
              <div className="text-xs text-gray-500">
                {data.superadmin.email}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPERADMIN: nothing extra; optional details */}
      {data.role?.toUpperCase() === "SUPERADMIN" && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold mb-3">Profile details</h3>
          <div className="text-sm text-gray-600">
            No additional org info for superadmin.
          </div>
        </div>
      )}
    </div>
  );
}
