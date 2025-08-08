import React from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  totalPages: number;
}

const Pagination = ({ page, totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  return (
    <div className="flex items-center justify-between mt-5">
      <Button
        variant="outline"
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={handlePrev}
        disabled={page === 1}
      >
        Prev
      </Button>
      <span className="text-sm">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={handleNext}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
