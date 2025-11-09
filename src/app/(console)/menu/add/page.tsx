"use client";
import React from "react";
import { MenuForm } from "@/components/menuform";
import { useSearchParams } from "next/navigation";
const AddMenuPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  
  return (
    <div className="max-w-2xl mx-auto w-full mt-20 ">
      <h1 className="text-2xl font-bold ">{id ? "Edit" : "Add"} Menu Item</h1>
      <div className="mt-10 bg-secondary-foreground p-4 rounded-md">
        <MenuForm id={id} />
      </div>
    </div>
  );
};

export default AddMenuPage;
