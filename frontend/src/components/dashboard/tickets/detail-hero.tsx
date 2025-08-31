"use client";
import { Shield, Clock, Phone, Mail, MapPin, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ITicketById } from "@/types/ticket.types";
import TicketAssets from "@/components/ticket-assets";

const TicketDetailHero = ({ ticket }: { ticket: ITicketById }) => {
  console.log("Ticket ", ticket);
  return (
    <section className="w-[90%] py-8 md:py-10 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400 via-white to-cyan-400 border border-blue-100 shadow-lg">
        <div className="px-8 py-12 md:px-12 md:py-16 md:col-span-2">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex capitalize items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                <Shield className="h-4 w-4" />
                {ticket?.status.toLowerCase()}
              </div>
              <div className="inline-flex capitalize items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                <Clock className="h-4 w-4" />
                {ticket.priority.toLowerCase()}
              </div>
            </div>

            <h1 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
              {ticket.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              {ticket.description}
            </p>
            {ticket.assets && ticket.assets.length > 0 && (
              <TicketAssets assets={ticket.assets} />
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 m-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src="/default.webp"
                alt={ticket.name}
                className="object-cover"
              />
              <AvatarFallback>{ticket.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{ticket.name}</h2>
              <p className="text-gray-500 text-sm">Customer</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              {ticket.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-green-500" />
              {ticket.phone}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-500" />
              {ticket.address}
            </div>
          </div>
        </div>
      </div>

      {ticket.items && ticket.items.length > 0 && (
        <div className="relative w-full border-t border-gray-300 pt-10">
          <h2 className="text-xl font-bold mb-8 text-center">
            Ticket Activity Timeline
          </h2>

          <div className="relative flex flex-col space-y-10">
            {/* Line */}
            <div className="absolute left-1/2 top-0 w-[2px] h-full bg-gray-300 -translate-x-1/2"></div>

            {ticket.items.map((item, index) => (
              <div
                key={item.id}
                className={`relative w-full flex ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div className="bg-white shadow-md rounded-xl p-6 w-[90%] md:w-[45%] relative z-10">
                  <div className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Created:</span>{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.description}</p>

                  {/* Assigned By */}
                  {(item.assignedByAdmin ||
                    item.assignedByCustomer ||
                    item.assignedByDept) && (
                    <div className="mt-4 text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">Assigned By:</span>{" "}
                        {item.assignedByAdmin
                          ? `${item.assignedByAdmin.name} (${item.assignedByRole})`
                          : item.assignedByCustomer
                          ? `${item.assignedByCustomer.name} (Customer)`
                          : item.assignedByDept
                          ? `${item.assignedByDept.name} (Department)`
                          : "System"}
                      </p>
                    </div>
                  )}

                  {/* Assigned To */}
                  {(item.assignedToAdmin ||
                    item.assignedToCustomer ||
                    item.assignedToDept) && (
                    <div className="text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">Assigned To:</span>{" "}
                        {item.assignedToAdmin
                          ? `${item.assignedToAdmin.name} (${item.assignedToRole})`
                          : item.assignedToCustomer
                          ? `${item.assignedToCustomer.name} (Customer)`
                          : item.assignedToDept
                          ? `${item.assignedToDept.name} (Department)`
                          : "Unassigned"}
                      </p>
                    </div>
                  )}

                  {/* Assets */}
                  {item.assets && item.assets.length > 0 && (
                    <div className="mt-4">
                      <TicketAssets assets={item.assets} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TicketDetailHero;
