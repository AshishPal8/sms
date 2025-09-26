"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Notification } from "@/types/notification.types";
import { toast } from "sonner";
import api from "@/lib/api";

interface NotificationsProps {
  onClose: () => void;
  setUnreadCount?: (n: number) => void;
}

export default function NotificationModal({
  onClose,
  setUnreadCount,
}: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // compute unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // expose unread count to parent
  useEffect(() => {
    setUnreadCount?.(unreadCount);
  }, [unreadCount, setUnreadCount]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data?.data ?? []);
    } catch (err) {
      console.error(err);
      toast?.error?.("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount (modal shown)
  useEffect(() => {
    fetchNotifications();
    // lock body scroll while modal mounted
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);

  const markAsRead = async (notif: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );

    try {
      await api.patch(`/notifications/read/${notif.id}`, { isRead: true });
    } catch (err) {
      console.error("Failed to mark as read", err);
      // rollback on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: false } : n))
      );
      toast?.error?.("Failed to mark notification as read");
    }
  };

  const handleClickNotification = async (notif: Notification) => {
    await markAsRead(notif);

    if (notif.data?.ticketId) {
      onClose();
      router.push(`/tickets/${notif.data.ticketId}/details`);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute w-full h-screen inset-0 bg-black/10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card container */}
      <div
        ref={cardRef}
        className="absolute right-32 top-14 z-50 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Notifications</CardTitle>
              <div className="text-sm text-muted-foreground">
                {unreadCount
                  ? `${unreadCount} unread`
                  : "No unread notifications"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-[60vh] overflow-auto">
              {loading ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <ul className="divide-y">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`cursor-pointer px-4 py-4 flex gap-4 items-start ${
                        n.isRead ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition`}
                      onClick={() => handleClickNotification(n)}
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-sm font-medium">
                            {n.title ?? "Notification"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {n.createdAt
                              ? formatDistanceToNowStrict(
                                  new Date(n.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )
                              : ""}
                          </div>
                        </div>

                        {/* optional message
                        <div className="text-sm text-muted-foreground mt-1">
                          {n.message ??
                            (n.data
                              ? JSON.stringify(n.data).slice(0, 120)
                              : "")}
                        </div> */}
                      </div>

                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {notifications.length} notifications
            </div>
            <div>
              <Link
                href="/notifications"
                className="text-sm font-medium text-primary"
              >
                View all
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
