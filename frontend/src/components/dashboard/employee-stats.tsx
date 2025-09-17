"use client";

import React from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Building,
  CircleDot,
  Flame,
  Loader2,
  MinusCircle,
  Snowflake,
  Ticket,
  Users,
} from "lucide-react";
import StatCard from "./stats-card";
import useAuthStore from "@/store/user";
import { roles } from "@/lib/utils";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface EmployeeStatsResponse {
  totalEmployees: number;
  newEmployeesLast30Days: number;
  byRole: {
    role: string;
    _count: { role: number };
  }[];
}

interface DivisionStatsResponse {
  totalDivisons: number;
  newDivisionsLast30Days: number;
}

interface TicketStatsResponse {
  totalTickets: number;
  last30Days: number;
  last7Days: number;
  status: Record<string, number>;
  priority: Record<string, number>;
  urgency: Record<string, number>;
}

interface RoleData {
  name: string;
  value: number;
}

interface EmployeeStatsResponse {
  totalEmployees: number;
  newEmployeesLast30Days: number;
  byRole: {
    role: string;
    _count: { role: number };
  }[];
}

const COLORS = ["#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa"];

const StatsHeader = ({
  employeeStats,
  divisionsStats,
  ticketStats,
}: {
  employeeStats: EmployeeStatsResponse | null;
  divisionsStats: DivisionStatsResponse | null;
  ticketStats: TicketStatsResponse | null;
}) => {
  const { user } = useAuthStore();

  const roleData: RoleData[] =
    employeeStats?.byRole.map((r) => ({
      name: r.role,
      value: r._count.role,
    })) || [];

  return (
    <div className="p-2 md:p-6 space-y-6">
      {user?.role === roles.SUPERADMIN && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-1 gap-4">
            <StatCard
              title="Total Employees"
              icon={<Users className="h-6 w-6" />}
              value={employeeStats?.totalEmployees || 0}
              diff={employeeStats?.newEmployeesLast30Days || 0}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              link="/dashboard/employees"
            />

            <StatCard
              title="Total Divisions"
              icon={<Building className="h-6 w-6" />}
              value={divisionsStats?.totalDivisons || 0}
              diff={divisionsStats?.newDivisionsLast30Days || 0}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              link="/dashboard/divisions"
            />
          </div>
          <div className="w-full p-4 rounded-lg bg-white shadow">
            <h2 className="text-lg font-semibold mb-4">Employees by Role</h2>
            {roleData.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No role data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {roleData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          icon={<Ticket className="h-6 w-6" />}
          value={ticketStats?.totalTickets || 0}
          diff={ticketStats?.last30Days || 0}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          link="/dashboard/tickets"
        />
        <StatCard
          title="In Progress"
          icon={<Loader2 className="h-6 w-6" />}
          value={ticketStats?.status.IN_PROGRESS || 0}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          link="/dashboard/tickets?status=IN_PROGRESS"
        />
        <StatCard
          title="Open"
          icon={<CircleDot className="h-6 w-6" />}
          value={ticketStats?.status.OPEN || 0}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          link="/dashboard/tickets?status=OPEN"
        />
        <StatCard
          title="Low Priority"
          icon={<ArrowDownCircle className="h-6 w-6" />}
          value={ticketStats?.priority.LOW || 0}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          link="/dashboard/tickets?priority=LOW"
        />
        <StatCard
          title="Medium Priority"
          icon={<MinusCircle className="h-6 w-6" />}
          value={ticketStats?.priority.MEDIUM || 0}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          link="/dashboard/tickets?priority=MEDIUM"
        />
        <StatCard
          title="High Priority"
          icon={<ArrowUpCircle className="h-6 w-6" />}
          value={ticketStats?.priority.HIGH || 0}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          link="/dashboard/tickets?priority=HIGH"
        />
        <StatCard
          title="Cold Tickets"
          icon={<Snowflake className="h-6 w-6" />}
          value={ticketStats?.urgency.COLD || 0}
          iconBg="bg-cyan-100"
          iconColor="text-cyan-600"
          link="/dashboard/tickets?urgencyLevel=COLD"
        />
        <StatCard
          title="Warm Tickets"
          icon={<Flame className="h-6 w-6" />}
          value={ticketStats?.urgency.WARM || 0}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          link="/dashboard/tickets?urgencyLevel=WARM"
        />
      </div>
    </div>
  );
};

export default StatsHeader;
