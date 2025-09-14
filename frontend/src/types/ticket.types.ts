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
  assignedByAdmin?: { id: string; firstname: string; lastname: string };
  assignedByCustomer?: { id: string; firstname: string; lastname: string };

  // Who it’s assigned to
  assignedToRole?:
    | "SUPERADMIN"
    | "MANAGER"
    | "TECHNICIAN"
    | "ASSISTANT"
    | "CUSTOMER";
  assignedToAdmin?: { id: string; firstname: string; lastname: string };
  assignedToCustomer?: { id: string; firstname: string; lastname: string };

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
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    insuranceCompany: string;
    insuranceDeductable: number;
    isRoofCovered: boolean;
  };
  items?: ITicketItem[];
}
