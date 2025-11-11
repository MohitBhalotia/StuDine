"use client";

import { ColumnDef } from "@tanstack/react-table";
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
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  CopyIcon,
  CalendarIcon,
} from "lucide-react";
import { useNoticeStore } from "@/store/noticeStore";
import { toast } from "sonner";
import Image from "next/image";

const ValidUntilCell = ({ notice }: { notice: Notices }) => {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        {notice.validUntil
          ? new Date(notice.validUntil).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "Not set"}
      </span>
    </div>
  );
};

export const columns: ColumnDef<Notices>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-left">Notice ID</div>,
    cell: ({ row }) => (
      <div className="truncate max-w-20">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: () => <div className="text-left">Title</div>,
    cell: ({ row }) => {
      return (
        <div className="max-w-[250px] truncate font-medium">
          {row.getValue("title")}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left">Description</div>,
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "image",
    header: () => <div className="text-left">Image</div>,
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string | undefined;
      return imageUrl ? (
        <Image
          src={imageUrl}
          alt="Notice"
          width={40}
          height={40}
          className="rounded-md object-cover"
        />
      ) : (
        <div className="text-xs text-muted-foreground">No image</div>
      );
    },
  },
  {
    accessorKey: "postedBy",
    header: () => <div className="text-left">Posted By</div>,
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("postedBy") ?? "N/A"}</div>;
    },
  },
  {
    accessorKey: "postedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Posted At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("postedAt") as Date;
      if (!date) return <div className="text-muted-foreground">N/A</div>;
      const formatted = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      return <div className="text-sm">{formatted}</div>;
    },
  },
  {
    accessorKey: "validUntil",
    header: () => <div className="text-left">Valid Until</div>,
    cell: ({ row }) => <ValidUntilCell notice={row.original} />,
  },
];
