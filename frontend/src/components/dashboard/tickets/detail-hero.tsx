"use client";
import { Shield, Clock, Phone, Mail, MapPin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ITicketById } from "@/types/ticket.types";
import TicketAssets from "@/components/ticket-assets";

const TicketDetailHero = ({ ticket }: { ticket: ITicketById }) => {
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
    </section>
  );
};

export default TicketDetailHero;
