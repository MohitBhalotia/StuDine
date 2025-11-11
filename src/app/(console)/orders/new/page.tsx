"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OrderForm } from "../orderForm";
import { Loader2 } from "lucide-react";
const NewOrderContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("menuId") ?? undefined;

  return (
    <div className="max-w-2xl mx-auto w-full mt-20 ">
      <h1 className="text-2xl font-bold text-center">Place Order</h1>
      <div className="mt-10 p-4 rounded-md">
        <OrderForm id={id} />
      </div>
    </div>
  );
};
export default function NewOrderPage() {
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
      <NewOrderContent />
    </Suspense>
  );
}

