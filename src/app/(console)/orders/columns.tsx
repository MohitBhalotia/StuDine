"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Trash2,
  CopyIcon,
} from "lucide-react";
import { useOrderStore } from "@/store/orderStore";
import { toast } from "sonner";

const StatusCell = ({ order }: { order: Order }) => {
  const { updateOrderInStore } = useOrderStore();
  const statusColors: Record<string, string> = {
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const handleStatusChange = async (newStatus: string) => {
    const updatedOrder = { ...order, status: newStatus as Order["status"] };
    console.log(updatedOrder);
    const result = await updateOrderInStore(updatedOrder, order.id as string);
    if (result.success) toast.success("Order status updated");
    else toast.error(result.message);
  };

  return (
    <Select value={order.status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[130px] h-6 border-0 shadow-none">
        <Badge variant="outline" className={statusColors[order.status]}>
          <SelectValue />
        </Badge>
      </SelectTrigger>
      <SelectContent>
        {["Pending", "Completed", "Cancelled"].map((status) => (
          <SelectItem key={status} value={status}>
            <div
              className={`flex items-center justify-center w-full px-2 py-1 rounded-md ${statusColors[status]}`}
            >
              {status}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const PaymentStatusCell = ({ order }: { order: Order }) => {
  const { updateOrderInStore } = useOrderStore();
  const paymentColors: Record<string, string> = {
    Paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Unpaid: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Refunded: "bg-blue-100 text-gray-800 dark:bg-blue-900 dark:text-gray-300",
  };

  const handlePaymentStatusChange = async (newStatus: string) => {
    const updatedOrder = {
      ...order,
      paymentStatus: newStatus as Order["paymentStatus"],
    };
    const result = await updateOrderInStore(updatedOrder, order.id as string);
    if (result.success) {
      toast.success("Payment status updated");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Select
      value={order.paymentStatus}
      onValueChange={handlePaymentStatusChange}
    >
      <SelectTrigger className="w-[130px] h-8 border-0 shadow-none">
        <Badge variant="outline" className={paymentColors[order.paymentStatus]}>
          <SelectValue />
        </Badge>
      </SelectTrigger>
      <SelectContent>
        {["Paid", "Unpaid", "Refunded"].map((status) => (
          <SelectItem key={status} value={status} className="bg-transparent">
            <div
              className={`flex items-center justify-center w-full px-2 py-1 rounded-md ${paymentColors[status]}`}
            >
              {status}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const PaymentMethodCell = ({ order }: { order: Order }) => {
  const { updateOrderInStore } = useOrderStore();

  const handlePaymentMethodChange = async (newMethod: string) => {
    const updatedOrder = {
      ...order,
      paymentMethod: newMethod as Order["paymentMethod"],
    };
    const result = await updateOrderInStore(updatedOrder, order.id as string);
    if (result.success) {
      toast.success("Payment method updated");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Select
      value={order.paymentMethod}
      onValueChange={handlePaymentMethodChange}
    >
      <SelectTrigger className="w-[100px] h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {["Cash", "Card", "Online"].map((method) => (
          <SelectItem key={method} value={method} className="bg-transparent">
            {method}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const ActionsCell = ({ order }: { order: Order }) => {
  const { deleteOrderFromStore } = useOrderStore();

  const handleDelete = async () => {
    const result = await deleteOrderFromStore(order.id as string);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(order.id || "")}
        >
          <CopyIcon className="mr-2 h-4 w-4" />
          Copy order ID
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
        {row.getValue("menuId")??"N/A"}
      </div>
    ),
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => (
      <div className="text-center truncate max-w-20">
        {row.getValue("userId")??"N/A"}
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
    header: "Status",
    cell: ({ row }) => <StatusCell order={row.original} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => <PaymentStatusCell order={row.original} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => <PaymentMethodCell order={row.original} />,
  },

  {
    accessorKey: "specialRequest",
    header: "Special Request",
    cell: ({ row }) => {
      const request = row.getValue("specialRequest") as string;
      return (
        <div className="max-w-[200px] truncate text-sm text-muted-foreground">
          {request || "None"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell order={row.original} />,
  },
];
