import { AssetType } from "@/enums/TicketAssetTypes";

export interface ITicket {
  id: string;
  name: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
}

export interface IAsset {
  id: string;
  url: string;
  type: AssetType;
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
}
