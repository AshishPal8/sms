export interface Notification {
  id: string;
  title: string;
  description: string;
  notificationType: string;
  actionType: string;
  data: {
    ticketId: string;
    ticketItemId: string;
  };
  createdAt: string;
  senderRole: string;
  senderAdminId: string | null;
  senderCustomerId: string | null;
  senderDeptId: string | null;
  isRead: boolean;
  receivers: {
    receiverRole: string;
    receiverAdminId: string | null;
    receiverCustomerId: string | null;
    receiverDeptId: string | null;
  }[];
}
