"use client";
import React from "react";
import { MenuForm } from "../menuform";
import { useSearchParams } from "next/navigation";
const AddMenuPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;

  return (
    <div className="max-w-2xl mx-auto w-full mt-8 ">
      <h1 className="text-3xl font-bold">Add Menu</h1>
      <MenuForm id={id} />
    </div>
  );
};

export default AddMenuPage;
