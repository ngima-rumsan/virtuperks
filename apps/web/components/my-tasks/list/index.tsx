"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { useGetTaskListByParticipant } from "@/hooks/subgraph/participant";
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
import { CheckCircle, User, Users } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useColumns } from "../details/details.column";
import ListCardDetails from "./list.card";
import { DatePickerWithRange } from "./list.date";

interface TaskListMainProps {
  router: AppRouterInstance;
}

const dummyOwnedTasks = [
  {
    id: "dummy-1",
    taskDetail: {
      name: "Dummy Owned Task",
      expiryDate: Date.now(),
      isOpen: true,
      detailsUrl: "#",
      id: "1",
      acceptedParticipantCount: 0,
      isTokenDisbursed: false,
      maxParticipants: 10,
    },
    rewardManagement: {
      rewardManagement: "0x1234567890",
    },
  },
];

export default function TaskListMain({ router }: TaskListMainProps) {
  const [tabStatus, setTabStatus] = useState("participating");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { address } = useWallet();
  const { data: myTaskList, isLoading } = useGetTaskListByParticipant(
    address as `0x${string}`,
  );

  const taskList = myTaskList?.data?.participantTaskStatuses || [];
  const columns = useColumns();

  const table = useReactTable({
    data: taskList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <LoaderSkeleton
        title
        subtitle
        titleWidth="w-56"
        subtitleWidth="w-72"
        cardCount={3}
        gridCols="grid-cols-3"
        cardHeight="h-24"
        showTabs
        tabsCount={2}
        rowCount={5}
        rowHeight="h-20"
        showPagination
      />
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
              <CardTitle className="flex items-center gap-2 p-0 mb-2 text-[#0F172A]">
                <User className="text-blue-500" size={20} />
                Owned
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                10
              </CardFooter>
            </CardHeader>
          </Card>

          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 p-0 mb-2 text-[#0F172A]">
                <Users className="text-purple-500" size={20} />
                Participating
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                5
              </CardFooter>
            </CardHeader>
          </Card>

          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 p-0 mb-2 text-[#0F172A]">
                <CheckCircle className="text-green-600" size={20} />
                Total Task Completed
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                5
              </CardFooter>
            </CardHeader>
          </Card>
        </div>

        {/* ✅ Tabs start */}
        <Tabs
          value={tabStatus}
          onValueChange={setTabStatus}
          defaultValue="participating"
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

          <div className="w-full mt-5 mb-5">
            <TabsContent className="w-full" value="participating">
              <ListCardDetails
                taskList={taskList}
                router={router}
                tabStatus="participating"
              />
            </TabsContent>
            <TabsContent className="w-full" value="owned">
              <ListCardDetails
                taskList={dummyOwnedTasks}
                router={router}
                tabStatus="owned"
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
        {/* ✅ Tabs end */}
      </div>
    </main>
  );
}
