import BookingForm from "@/components/book-a-service/booking-form";
import ServiceHero from "@/components/book-a-service/hero";
import React from "react";

const BookAService = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <ServiceHero />
      <BookingForm />
    </div>
  );
};

export default BookAService;
