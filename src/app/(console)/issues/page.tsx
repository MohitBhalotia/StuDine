"use client";

import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon, Filter, X, Bug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useIssueStore } from "@/store/issueStore";

const IssuesPage = () => {
  const router = useRouter();
  const { issues, loading, fetchIssues } = useIssueStore();
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Filter issues based on selected filters
  const filteredIssues = issues.filter((issue) => {
    const statusMatch =
      statusFilter.length === 0 ||
      statusFilter.includes(issue.status || "Open");
    return statusMatch;
  });

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setStatusFilter([]);
  };

  const hasActiveFilters = statusFilter.length > 0;

  return (
    <div className="px-4 py-6 bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Issues</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your issues
          </p>
        </div>
        <Button
          onClick={() => router.push("/issues/new")}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Issue
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && issues.length === 0 && (
        <div className="flex justify-center mt-20">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bug className="w-6 h-6" />
              </EmptyMedia>
              <EmptyTitle>No Issues Found</EmptyTitle>
              <EmptyDescription>
                You haven't raised any issues yet. Start by creating your first
                issue.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => router.push("/issues/new")}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Raise Your First Issue
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      )}

      {/* Issues Table */}
      {!loading && issues.length > 0 && (
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
                {["Open", "Progress", "Resolved", "Hold"].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => toggleStatusFilter(status)}
                  >
                    {status}
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
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredIssues}
            searchKey="title"
            searchPlaceholder="Search by issue title..."
          />
        </div>
      )}
    </div>
  );
};

export default IssuesPage;
