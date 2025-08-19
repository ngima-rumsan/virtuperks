"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import {
  useGetTaskListByParticipant,
  useGetTaskListOwned,
} from "@/hooks/subgraph/participant";
import { useWallet } from "@/providers/walletProvider";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { AlertCircle, CheckCircle, User, Users } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useColumns } from "../details/details.column";
import ListCardDetails from "./list.card";
import { DatePickerWithRange } from "./list.date";

interface TaskListMainProps {
  router: AppRouterInstance;
}

export default function TaskListMain({ router }: TaskListMainProps) {
  const [tabStatus, setTabStatus] = useState<"participating" | "owned">(
    "participating",
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { address } = useWallet();
  console.log("Wallet: ", address);

  const { data: participatingTask, isLoading: participatingLoading } =
    useGetTaskListByParticipant(address as `0x${string}`);

  const { data: ownedTask, isLoading: ownedLoading } = useGetTaskListOwned(
    address as `0x${string}`,
  );

  const participatingTaskList =
    participatingTask?.data?.participantTaskStatuses || [];

  const ownedTaskList = ownedTask?.data?.taskCreateds || [];

  console.log("Participating Task List:", participatingTask);
  console.log("Owned Task List:", ownedTask);

  const columns = useColumns();

  const participatingTable = useReactTable({
    data: participatingTaskList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  });

  const ownedTable = useReactTable({
    data: ownedTaskList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    pageCount: Math.ceil(ownedTaskList.length / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
  });

  if (participatingLoading || ownedLoading) {
    return (
      <LoaderSkeleton showTabs showPagination rowCount={5} cardCount={3} />
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full overflow-x-hidden">
      <div className="space-y-4">
        <div className="flex items-center mt-5">
          <div className="flex flex-col w-[80%] gap-1">
            <h1 className="font-bold text-3xl">My List</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              List of all the tasks you participated in
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-4 mt-1 gap-4 w-full">
          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 text-[#0F172A]">
                <User className="text-blue-500" size={20} /> Owned
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                10
              </CardFooter>
            </CardHeader>
          </Card>
          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 text-[#0F172A]">
                <Users className="text-purple-500" size={20} /> Participating
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                5
              </CardFooter>
            </CardHeader>
          </Card>
          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 text-[#0F172A]">
                <CheckCircle className="text-green-600" size={20} />
                Total Task Completed
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                5
              </CardFooter>
            </CardHeader>
          </Card>
        </div>

        {/* ✅ Tabbed List */}
        <Tabs
          value={tabStatus}
          onValueChange={(value) => {
            if (value === "participating" || value === "owned") {
              setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
              setTabStatus(value);
            }
          }}
        >
          <div className="flex items-center mt-10 mb-10">
            <div className="w-[400px]">
              <TabsList className="flex bg-blue-50 h-10">
                <TabsTrigger value="participating" className="w-full h-8">
                  Participating
                </TabsTrigger>
                <TabsTrigger value="owned" className="w-full h-8">
                  Owned
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="ml-auto">
              <DatePickerWithRange />
            </div>
          </div>

          <TabsContent value="participating">
            <Card className="p-4">
              {participatingTaskList.length === 0 ? (
                <div className="text-gray-500 text-center py-6 flex flex-col items-center gap-2">
                  <AlertCircle className="text-gray-400" size={32} />
                  <p>No participating tasks found.</p>
                  <p className="text-sm text-gray-400 max-w-md">
                    You have not participated in any tasks yet.
                  </p>
                </div>
              ) : (
                <>
                  <ListCardDetails
                    taskList={participatingTaskList}
                    router={router}
                    tabStatus="participating"
                  />
                  <DataTablePagination
                    table={participatingTable}
                    pagination={pagination}
                    setPagination={setPagination}
                  />
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="owned">
            <Card className="p-4">
              {ownedTaskList.length === 0 ? (
                <div className="text-gray-500 text-center py-6 flex flex-col items-center gap-2">
                  <AlertCircle className="text-gray-400" size={32} />
                  <p>No owned tasks found.</p>
                  <p className="text-sm text-gray-400 max-w-md">
                    You have not created any tasks yet.
                  </p>
                </div>
              ) : (
                <>
                  <ListCardDetails
                    taskList={ownedTaskList}
                    router={router}
                    tabStatus="owned"
                  />
                  <DataTablePagination
                    table={ownedTable}
                    pagination={pagination}
                    setPagination={setPagination}
                  />
                </>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
