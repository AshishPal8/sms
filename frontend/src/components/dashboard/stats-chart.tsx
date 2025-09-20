"use client";
import useSettingsStore from "@/store/settings";
import { format } from "date-fns";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface TicketTrend {
  date: string;
  count: number;
}

interface TicketStatsResponse {
  totalTickets: number;
  last30Days: number;
  last7Days: number;
  status: Record<string, number>;
  priority: Record<string, number>;
  urgency: Record<string, number>;
  trend: TicketTrend[];
}

const StatsChart = ({
  ticketStats,
}: {
  ticketStats: TicketStatsResponse | null;
}) => {
  const dateFormat = useSettingsStore((s) => s.getDateFormat());

  if (!ticketStats || !ticketStats.trend) {
    return <div>No data available</div>;
  }

  return (
    <div className="p-2 md:p-6 space-y-6">
      <div className="w-full h-80 p-2 md:p-4 rounded-lg bg-white shadow">
        <h2 className="text-base md:text-lg font-semibold mb-4">
          Tickets Trend (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ticketStats.trend}>
            <defs>
              <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value: string) => {
                try {
                  return format(new Date(value), dateFormat as any);
                } catch {
                  return value;
                }
              }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(value) => {
                try {
                  return format(new Date(value), dateFormat as any);
                } catch {
                  return value;
                }
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorTickets)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsChart;
