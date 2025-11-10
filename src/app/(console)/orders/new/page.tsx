"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { OrderForm } from "../orderForm";
const NewOrderPage = () => {
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

export default NewOrderPage;
