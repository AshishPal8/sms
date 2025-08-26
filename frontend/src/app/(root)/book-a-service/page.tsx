import React from "react";
import BookingForm from "@/components/book-a-service/booking-form";
import ServiceHero from "@/components/book-a-service/hero";

const BookAService = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <ServiceHero />
      <BookingForm />
    </div>
  );
};

export default BookAService;
