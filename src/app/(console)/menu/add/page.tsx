"use client";
import React from "react";
import { MenuForm } from "@/components/menuform";
import { useSearchParams } from "next/navigation";
const AddMenuPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;

  return (
    <div className="max-w-2xl mx-auto w-full mt-20 ">
      <MenuForm id={id} />
    </div>
  );
};

export default AddMenuPage;
