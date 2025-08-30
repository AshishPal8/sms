"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "@/config";
import StatsHeader from "@/components/dashboard/employee-stats";
import useAuthStore from "@/store/user";
import { roles } from "@/lib/utils";
import StatsChart from "@/components/dashboard/stats-chart";

const Dashboard = () => {
  const { user } = useAuthStore();
  const [employeeStats, setEmployeeStats] = useState(null);
  const [departmentStats, setDepartmentStats] = useState(null);
  const [ticketStats, setTicketStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === roles.SUPERADMIN) {
      const fetchEmployeesStats = async () => {
        try {
          const res = await axios.get(`${baseUrl}/employees/stats`, {
            withCredentials: true,
          });
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
          const res = await axios.get(`${baseUrl}/departments/stats`, {
            withCredentials: true,
          });
          const { data } = await res.data;
          setDepartmentStats(data);
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
        const res = await axios.get(`${baseUrl}/tickets/stats`, {
          withCredentials: true,
        });
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
        departmentStats={departmentStats}
        ticketStats={ticketStats}
      />
      <StatsChart ticketStats={ticketStats} employeeStats={employeeStats} />
    </div>
  );
};

export default Dashboard;
