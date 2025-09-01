import { AssetType } from "@/enums/TicketAssetTypes";

export interface ITicket {
  id: string;
  name: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  urgencyLevel: "COLD" | "WARM";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
}

export interface IAsset {
  id: string;
  url: string;
  type: AssetType;
}

export interface ITicketItem {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  isPublic?: boolean;
  assets?: IAsset[];

  // Who assigned this ticket item
  assignedByRole?:
    | "SUPERADMIN"
    | "MANAGER"
    | "TECHNICIAN"
    | "ASSISTANT"
    | "CUSTOMER";
  assignedByAdmin?: { id: string; name: string };
  assignedByDept?: { id: string; name: string };
  assignedByCustomer?: { id: string; name: string };

  // Who it’s assigned to
  assignedToRole?:
    | "SUPERADMIN"
    | "MANAGER"
    | "TECHNICIAN"
    | "ASSISTANT"
    | "CUSTOMER";
  assignedToAdmin?: { id: string; name: string };
  assignedToDept?: { id: string; name: string };
  assignedToCustomer?: { id: string; name: string };

  createdAt: string;
}

export interface ITicketById {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  description: string;
  assets?: IAsset[];
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  urgencyLevel: "COLD" | "WARM";
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    insuranceCompany: string;
    insuranceDeductable: number;
    isRoofCovered: boolean;
  };
  items?: ITicketItem[];
}
