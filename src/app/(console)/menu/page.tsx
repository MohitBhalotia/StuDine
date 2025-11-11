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

const MenuPage = () => {
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
        <Button
          onClick={() => router.push("/menu/add")}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Item
        </Button>
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
                You haven’t added any items yet.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => router.push("/menu/add")}>
                Add Your First Item
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      )}

      {/* Table */}
      {!loading && menus.length > 0 && (
        <div className="overflow-x-auto rounded-lg max-w-5xl mx-auto shadow-md bg-card border border-border mt-10">
          <Table>
            <TableHeader className="bg-accent/50">
              <TableRow>
                <TableHead className="text-card-foreground w-1/7">
                  Day
                </TableHead>
                <TableHead className="text-card-foreground w-1/7">
                  Meal Time
                </TableHead>
                <TableHead className="text-card-foreground w-1/7">
                  Type
                </TableHead>
                <TableHead className="text-card-foreground w-1/7">
                  Description
                </TableHead>
                <TableHead className="text-right text-card-foreground w-1/7">
                  Price
                </TableHead>
                <TableHead className="text-right text-card-foreground w-1/7">
                  Action
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
                  <TableCell className="text-right text-card-foreground">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisIcon className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/menu/qr-code?id=${menu.id}`)
                          }
                        >
                          <QrCodeIcon className="w-4 h-4" /> Generate QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/menu/add?id=${menu.id}`)}
                        >
                          <PencilIcon className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteMenuFromStore(menu.id)}
                        >
                          <TrashIcon className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default MenuPage;
