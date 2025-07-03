"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { useClosedTask, useOpenTask } from "@/hooks/subgraph/task";
import { PATHS } from "@/routes/paths";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Plus } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useColumns } from "../details/details.column";
import ListCardDetails from "./list.card";
import { DatePickerWithRange } from "./list.date";

interface TaskListMainProps {
  router: AppRouterInstance;
}

export default function TaskListMain({ router }: TaskListMainProps) {
  const [tabStatus, setTabStatus] = useState<"open" | "closed">("open");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const openTask = useOpenTask();
  const closeTask = useClosedTask();

  const openTaskList = openTask?.data?.data?.taskCreateds ?? [];
  const closedTaskList = closeTask?.data?.data?.taskCreateds ?? [];

  const isLoading =
    (tabStatus === "open" && openTask.isLoading) ||
    (tabStatus === "closed" && closeTask.isLoading);

  const currentTaskList = tabStatus === "open" ? openTaskList : closedTaskList;

  const columns = useColumns();

  const table = useReactTable({
    data: currentTaskList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  if (isLoading) {
    return (
      <LoaderSkeleton
        title
        subtitle
        titleWidth="w-40"
        subtitleWidth="w-64"
        showTabs
        showDatePicker
        showCreateButton
        cardCount={6}
        gridCols="flex-col"
        cardHeight="h-24"
        showPagination
      />
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex flex-col w-[80%] gap-1">
            <h1 className="font-bold text-xl">Task List</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              List of all the tasks
            </h3>
          </div>

          <div className="flex flex-col ml-auto justify-end h-full">
            <Button
              className="min-w-[10rem] fw-[600] h-10"
              variant="default"
              onClick={() => router.push(PATHS.TASKS.ADD)}
            >
              <Plus size={22} strokeWidth={2.75} />
              <span>Create Task</span>
            </Button>
          </div>
        </div>

        <Tabs value={tabStatus} defaultValue="open">
          <div className="flex items-center">
            <div className="w-[400px]">
              <TabsList className="flex bg-blue-50 h-10">
                <TabsTrigger
                  value="open"
                  className="w-full h-8"
                  onClick={() => setTabStatus("open")}
                >
                  Open
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  className="w-full h-8"
                  onClick={() => setTabStatus("closed")}
                >
                  Closed
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="ml-auto">
              <DatePickerWithRange />
            </div>
          </div>

          <div className="w-full mt-5 mb-5">
            <TabsContent className="w-full" value="open">
              <ListCardDetails
                taskList={openTaskList}
                router={router}
                tabStatus="open"
              />
            </TabsContent>
            <TabsContent className="w-full" value="closed">
              <ListCardDetails
                taskList={closedTaskList}
                router={router}
                tabStatus="closed"
              />
            </TabsContent>
          </div>

          <div className="mt-5 mb-5">
            <DataTablePagination
              table={table}
              setPagination={setPagination}
              pagination={pagination}
            />
          </div>
        </Tabs>
      </div>
    </main>
  );
}
