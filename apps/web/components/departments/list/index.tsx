"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { useGetAllEntity } from "@/hooks/subgraph/entity";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DepartmentDetails } from "@workspace/sdk/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";
import DepartmentListCard from "./list.card";
import ListToolBar from "./list.toolbar";

interface DepartmentListProps {
  router: AppRouterInstance;
}

export default function DepartmentList({ router }: DepartmentListProps) {
  const getAllEntity = useGetAllEntity();

  const entityList: DepartmentDetails[] =
    getAllEntity?.data?.data?.rewardManagementCreateds || [];

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: entityList,
    columns: [], // no column definitions used in card list view
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
  });

  // slice data manually if card view is not using react-table rows
  const paginatedEntities = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return entityList.slice(start, end);
  }, [entityList, pagination]);

  if (getAllEntity.isLoading) {
    return (
      <LoaderSkeleton
        title
        subtitle
        titleWidth="w-40"
        subtitleWidth="w-64"
        showTabs={false}
        showDatePicker={false}
        showCreateButton={true}
        cardCount={20}
        gridCols="grid-cols-4"
        cardHeight="h-48"
        showPagination={false}
      />
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-1 my-3">
          <h1 className="font-bold text-4xl">Department</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Overview of all the departments
          </h3>
        </div>

        <ListToolBar />

        {/* paginated list */}
        <DepartmentListCard router={router} entityList={paginatedEntities} />

        {/* pagination */}
        <div className="mt-5 mb-5">
          <DataTablePagination
            table={table}
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>
      </div>
    </main>
  );
}
