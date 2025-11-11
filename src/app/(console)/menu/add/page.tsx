"use client";
import React, { Suspense } from "react";
import { MenuForm } from "../menuform";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
const AddMenuContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;

  return (
    <div className="max-w-2xl mx-auto w-full mt-8 ">
      <h1 className="text-3xl font-bold">Add Menu</h1>
      <MenuForm id={id} />
    </div>
  );
};
export default function AddMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 text-blue-500">
            <Loader2 className="h-12 w-12 text-blue-500" />
          </div>
        </div>
      }
    >
      <AddMenuContent />
    </Suspense>
  );
}
