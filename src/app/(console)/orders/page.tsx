"use client";

import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon, ShoppingBag, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/orderStore";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DataTable } from "@/app/(console)/orders/OrderTable";
import { columns } from "./columns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const OrdersPage = () => {
  const router = useRouter();
  const { orders, loading, fetchOrders } = useOrderStore();
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<string[]>([]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders based on selected filters
  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      statusFilter.length === 0 || statusFilter.includes(order.status);
    const paymentMatch =
      paymentFilter.length === 0 || paymentFilter.includes(order.paymentStatus);
    return statusMatch && paymentMatch;
  });

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const togglePaymentFilter = (payment: string) => {
    setPaymentFilter((prev) =>
      prev.includes(payment)
        ? prev.filter((p) => p !== payment)
        : [...prev, payment]
    );
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setPaymentFilter([]);
  };

  const hasActiveFilters = statusFilter.length > 0 || paymentFilter.length > 0;

  return (
    <div className="px-4 py-6 bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your orders
          </p>
        </div>
        <Button
          onClick={() => router.push("/orders/new")}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="flex justify-center mt-20">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBag className="w-6 h-6" />
              </EmptyMedia>
              <EmptyTitle>No Orders Found</EmptyTitle>
              <EmptyDescription>
                You haven't placed any orders yet. Start by creating your first
                order.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => router.push("/orders/new")}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Place Your First Order
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      )}

      {/* Orders Table */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Status
                  {statusFilter.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 rounded-full px-1.5 py-0"
                    >
                      {statusFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["Pending", "Completed", "Delivered", "Cancelled"].map(
                  (status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilter.includes(status)}
                      onCheckedChange={() => toggleStatusFilter(status)}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Payment Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Payment
                  {paymentFilter.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 rounded-full px-1.5 py-0"
                    >
                      {paymentFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel>Filter by Payment</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["Paid", "Unpaid", "Refunded"].map((payment) => (
                  <DropdownMenuCheckboxItem
                    key={payment}
                    checked={paymentFilter.includes(payment)}
                    onCheckedChange={() => togglePaymentFilter(payment)}
                  >
                    {payment}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 lg:px-3"
              >
                Clear
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}

            {/* Active Filter Tags */}
            <div className="flex gap-2 flex-wrap">
              {statusFilter.map((status) => (
                <Badge
                  key={status}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleStatusFilter(status)}
                >
                  {status}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
              {paymentFilter.map((payment) => (
                <Badge
                  key={payment}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => togglePaymentFilter(payment)}
                >
                  {payment}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredOrders}
            searchKey="id"
            searchPlaceholder="Search by order ID..."
          />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
