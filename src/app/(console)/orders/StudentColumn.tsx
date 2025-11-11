"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="text-center truncate max-w-20">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "menuId",
    header: "Menu ID",
    cell: ({ row }) => (
      <div className="text-center truncate max-w-20">
        {row.getValue("menuId") ?? "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => (
      <div className="text-center truncate max-w-20">
        {row.getValue("userId") ?? "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "orderTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("orderTime") as Date;
      if (!date) return <div className="text-muted-foreground">N/A</div>;
      const formatted = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div className="text-sm">{formatted}</div>;
    },
  },

  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("quantity")}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div className="font-medium text-center mr-10">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColors: Record<string, string> = {
        Pending:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        Confirmed:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        Delivered:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      };
      return (
        <Badge variant="outline" className={statusColors[status]}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: () => <div className="text-left">Payment</div>,
    cell: ({ row }) => {
      const paymentStatus = row.getValue("paymentStatus") as string;
      const paymentColors: Record<string, string> = {
        Paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Unpaid: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        Refunded:
          "bg-blue-100 text-gray-800 dark:bg-blue-900 dark:text-gray-300",
      };
      return (
        <Badge variant="outline" className={paymentColors[paymentStatus]}>
          {paymentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: () => <div className="text-left">Method</div>,
    cell: ({ row }) => {
      return (
        <div className="text-sm capitalize">
          {row.getValue("paymentMethod")}
        </div>
      );
    },
  },
  {
    accessorKey: "specialRequest",
    header: () => <div className="text-left">Special Request</div>,
    cell: ({ row }) => {
      const request = row.getValue("specialRequest") as string;
      return (
        <div className="max-w-[200px] truncate text-sm text-muted-foreground">
          {request || "None"}
        </div>
      );
    },
  },
];
