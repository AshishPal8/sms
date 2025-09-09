"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "@/config";
import { useParams } from "next/navigation";
import { DivisionForm } from "@/components/dashboard/division/div-form";

function EditDivision() {
  const [division, setDivision] = useState({
    name: "",
    isActive: true,
  });
  const { divId } = useParams();

  useEffect(() => {
    if (!divId) return;

    const fetchDivision = async () => {
      const res = await axios.get(`${baseUrl}/divisions/${divId}`, {
        withCredentials: true,
      });

      const { data } = res.data;

      setDivision(data);
    };

    fetchDivision();
  }, [divId]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DivisionForm initialData={division} />
      </div>
    </div>
  );
}

export default EditDivision;
