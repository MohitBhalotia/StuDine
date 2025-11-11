"use client";

import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DataTable } from "@/app/(console)/orders/OrderTable";
import { columns } from "./StudentColumn";
import { useNoticeStore } from "@/store/noticeStore";
const NoticesPage = () => {
  const router = useRouter();
  const { notices, loading, fetchNotices } = useNoticeStore();
  useEffect(() => {
      fetchNotices();
  }, [fetchNotices]);

  return (
    <div className="px-4 py-6 bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your notices
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
      {!loading && notices.length === 0 && (
        <div className="flex justify-center mt-20">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell className="w-6 h-6" />
              </EmptyMedia>
              <EmptyTitle>No Notices Found</EmptyTitle>
              <EmptyDescription>
                No notices currently !
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}

      {/* Notices Table */}
      {!loading && notices.length > 0 && (
        <div className="space-y-4">
          {/* Data Table */}
          <DataTable
            columns={columns}
            data={notices}
            searchKey="title"
            searchPlaceholder="Search by notice title..."
          />
        </div>
      )}
    </div>
  );
};

export default NoticesPage;
