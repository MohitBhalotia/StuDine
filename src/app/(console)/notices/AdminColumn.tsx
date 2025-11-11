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
  ChevronDownIcon,
} from "lucide-react";
import { useNoticeStore } from "@/store/noticeStore";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const ValidUntilCell = ({ notice }: { notice: Notices }) => {
  const { updateNoticeInStore } = useNoticeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    notice.validUntil ? new Date(notice.validUntil) : undefined
  );

  const handleSave = async () => {
    const updatedNotice = {
      ...notice,
      validUntil: date,
    };
    const result = await updateNoticeInStore(updatedNotice, notice.id!);
    if (result.success) {
      toast.success("Valid until date updated");
      setIsEditing(false);
    } else {
      toast.error(result.message);
    }
  };

  if (isEditing) {
    return (
      <div className="flex gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              ) : (
                <span className="text-muted-foreground">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              captionLayout="dropdown"
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button size="sm" variant="default" onClick={handleSave}>
          Save
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setIsEditing(false);
            setDate(
              notice.validUntil ? new Date(notice.validUntil) : undefined
            );
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 cursor-pointer hover:text-primary"
      onClick={() => setIsEditing(true)}
    >
      <CalendarIcon className="h-4 w-4" />
      <span className="text-sm">
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

const ActionsCell = ({ notice }: { notice: Notices }) => {
  const { deleteNoticeFromStore } = useNoticeStore();

  const handleDelete = async () => {
    const result = await deleteNoticeFromStore(notice.id!);
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
          onClick={() => navigator.clipboard.writeText(notice.id || "")}
        >
          <CopyIcon className="mr-2 h-4 w-4" />
          Copy notice ID
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete notice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
      return <div className="text-sm">{row.getValue("postedBy")?? "N/A"}</div>;
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
  {
    id: "actions",
    header: () => <div className="text-left">Actions</div>,
    cell: ({ row }) => <ActionsCell notice={row.original} />,
  },
];
