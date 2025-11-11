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

import { ArrowUpDown, MoreHorizontal, Trash2, CopyIcon } from "lucide-react";
import { useIssueStore } from "@/store/issueStore";
import { toast } from "sonner";
import Image from "next/image";

const StatusCell = ({ issue }: { issue: Issues }) => {
  const statusColors: Record<string, string> = {
    Open: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Resolved:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Hold: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <Badge
      variant="outline"
      className={statusColors[issue.status || "Open"] + " ml-10"}
    >{issue.status}</Badge>
  );
};

const ActionsCell = ({ issue }: { issue: Issues }) => {
  const { deleteIssueFromStore } = useIssueStore();

  const handleDelete = async () => {
    const result = await deleteIssueFromStore(issue.id as string);
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
          onClick={() => navigator.clipboard.writeText(issue.id as string)}
        >
          <CopyIcon className="mr-2 h-4 w-4" />
          Copy issue ID
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete issue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Issues>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-left">Issue ID</div>,
    cell: ({ row }) => (
      <div className="truncate max-w-20">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "userId",
    header: () => <div className="text-left">User ID</div>,
    cell: ({ row }) => (
      <div className="truncate max-w-20">{row.getValue("userId")}</div>
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
          alt="Issue"
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
    accessorKey: "status",
    header: () => <div className=" ml-10 text-left">Status</div>,
    cell: ({ row }) => <StatusCell issue={row.original} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
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
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      if (!date) return <div className="text-muted-foreground">N/A</div>;
      const formatted = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      return <div className="text-sm">{formatted}</div>;
    },
  },
  
];
