"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisIcon, Loader2, MenuIcon, PencilIcon, PlusIcon, QrCodeIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMenuStore } from "@/store/menuStore";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const StudentMenuPage = () => {
  const router = useRouter();
  const { menus, loading, fetchMenus, deleteMenuFromStore } = useMenuStore();

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const getMenuTypeIcon = (type: string) => {
    if (type === "Veg")
      return (
        <Status status="online">
          <StatusIndicator />
          <StatusLabel className="font-mono">Veg</StatusLabel>
        </Status>
      );
    if (type === "Non-veg")
      return (
        <Status status="offline">
          <StatusIndicator />
          <StatusLabel className="font-mono">Non-Veg</StatusLabel>
        </Status>
      );
    if (type === "Jain")
      return (
        <Status status="maintenance">
          <StatusIndicator />
          <StatusLabel className="font-mono">Jain</StatusLabel>
        </Status>
      );
  };

  return (
    <div className="px-4 py-6 bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Menu</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your menu items
          </p>
        </div>
        
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && menus.length === 0 && (
        <div className="flex justify-center mt-20">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MenuIcon className="w-4 h-4" />
              </EmptyMedia>
              <EmptyTitle>No Items Found</EmptyTitle>
              <EmptyDescription>
                No items currently !
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}

      {/* Table */}
      {!loading && menus.length > 0 && (
        <div className="overflow-x-auto rounded-lg max-w-5xl mx-auto shadow-md bg-card border border-border mt-10">
          <Table>
            <TableHeader className="bg-accent/50">
              <TableRow>
                <TableHead className="text-card-foreground w-1/6">
                  Day
                </TableHead>
                <TableHead className="text-card-foreground w-1/6">
                  Meal Time
                </TableHead>
                <TableHead className="text-card-foreground w-1/6">
                  Type
                </TableHead>
                <TableHead className="text-card-foreground w-1/6">
                  Description
                </TableHead>
                <TableHead className="text-right text-card-foreground w-1/6">
                  Price
                </TableHead>
                
              </TableRow>
            </TableHeader>

            <TableBody>
              {menus.map((menu: Menu) => (
                <TableRow
                  key={menu.id}
                  className="hover:bg-accent/30 transition-colors"
                >
                  <TableCell className="font-medium text-card-foreground">
                    {menu.day}
                  </TableCell>
                  <TableCell className="text-card-foreground">
                    {menu.mealTime}
                  </TableCell>
                  <TableCell className="text-card-foreground">
                    {getMenuTypeIcon(menu.type)}
                  </TableCell>
                  <TableCell className="text-card-foreground truncate max-w-[160px]">
                    {menu.description}
                  </TableCell>
                  <TableCell className="text-right font-medium text-card-foreground">
                    ₹{menu.price}
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StudentMenuPage;
