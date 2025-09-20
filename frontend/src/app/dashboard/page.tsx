"use client";
import React, { useState, useEffect } from "react";
import StatsHeader from "@/components/dashboard/employee-stats";
import useAuthStore from "@/store/user";
import { roles } from "@/lib/utils";
import StatsChart from "@/components/dashboard/stats-chart";
import api from "@/lib/api";

const Dashboard = () => {
  const { user } = useAuthStore();
  const [employeeStats, setEmployeeStats] = useState(null);
  const [divisionsStats, setDivisionsStats] = useState(null);
  const [ticketStats, setTicketStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === roles.SUPERADMIN) {
      const fetchEmployeesStats = async () => {
        try {
          const res = await api.get(`/employees/stats`);
          const { data } = await res.data;
          setEmployeeStats(data);
        } catch (err) {
          console.error("Failed to fetch employee stats:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployeesStats();
    }
  }, [user?.role]);

  useEffect(() => {
    if (user?.role === roles.SUPERADMIN) {
      const fetchDepartmentsStats = async () => {
        try {
          const res = await api.get(`/divisions/stats`);
          const { data } = await res.data;
          setDivisionsStats(data);
        } catch (err) {
          console.error("Failed to fetch department stats:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDepartmentsStats();
    }
  }, [user?.role]);

  useEffect(() => {
    const fetchTicketsStats = async () => {
      try {
        const res = await api.get(`/tickets/stats`);
        const { data } = await res.data;
        setTicketStats(data);
      } catch (err) {
        console.error("Failed to fetch tickets stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketsStats();
  }, []);

  return (
    <div>
      <StatsHeader
        employeeStats={employeeStats}
        divisionsStats={divisionsStats}
        ticketStats={ticketStats}
      />
      <StatsChart ticketStats={ticketStats} />
    </div>
  );
};

export default Dashboard;
