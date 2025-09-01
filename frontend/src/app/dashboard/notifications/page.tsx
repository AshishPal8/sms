"use client";
import { Card } from "@/components/ui/card";
import { baseUrl } from "@/config";
import { Notification } from "@/types/notification.types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/notifications`, {
        withCredentials: true,
      });
      setNotifications(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch notifications");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notif: Notification) => {
    if (notif.data?.ticketId) {
      router.push(`/dashboard/tickets/${notif.data.ticketId}/details`);
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );

    axios
      .patch(
        `${baseUrl}/notifications/read/${notif.id}`,
        { isRead: true },
        { withCredentials: true }
      )
      .then(() => {
        console.log(`Notification ${notif.id} marked as read`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 space-y-4">
      {loading && <p>Loading notifications...</p>}

      {!loading && notifications.length === 0 && (
        <p className="text-gray-500">No notifications found.</p>
      )}

      {notifications.map((notif) => (
        <Card
          key={notif.id}
          onClick={() => markAsRead(notif)}
          className={`p-4 rounded-2xl shadow cursor-pointer transition hover:shadow-md border-l-4 ${
            notif.isRead
              ? "bg-gray-100 border-gray-300"
              : "bg-white border-blue-500"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2
                className={`text-lg font-semibold ${
                  notif.isRead ? "text-gray-700" : "text-blue-700"
                }`}
              >
                {notif.title}
              </h2>
              <p
                className={`text-sm ${
                  notif.isRead ? "text-gray-600" : "text-gray-800"
                }`}
              >
                {notif.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From: {notif.senderRole} |{" "}
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NotificationsPage;
