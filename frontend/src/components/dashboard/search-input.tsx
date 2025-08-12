"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";

let debounceTimer: NodeJS.Timeout;

interface ISearchInput {
  placeholder?: string;
}
const SearchInput = ({ placeholder }: ISearchInput) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [value, setValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
        params.set("page", "1");
      } else {
        params.delete("search");
      }
      router.push(`?${params.toString()}`);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [value, router, searchParams]);

  return (
    <div className="w-full md:w-[40%]">
      <Input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-white"
      />
    </div>
  );
};

export default SearchInput;
