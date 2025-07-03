"use client";

import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { useGetAllEntity } from "@/hooks/subgraph/entity";
import { DepartmentDetails } from "@workspace/sdk/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TokenMarketListCard from "./list.card";

interface DepartmentListProps {
  router: AppRouterInstance;
}

export default function DepartmentList({ router }: DepartmentListProps) {
  const getAllEntity = useGetAllEntity();
  const entityList: DepartmentDetails[] =
    getAllEntity?.data?.data?.rewardManagementCreateds || [];
  if (getAllEntity.isLoading) {
    return (
      <LoaderSkeleton
        title
        subtitle
        titleWidth="w-40"
        subtitleWidth="w-64"
        showTabs={false} // Adjust based on layout, no tabs here
        showDatePicker={false} // Adjust based on layout, no date picker here
        showCreateButton={true} // Show add button skeleton
        cardCount={20} // Show 5 skeleton cards to match layout
        gridCols="grid-cols-4" // Match your grid layout (4 columns)
        cardHeight="h-48" // Adjust card height for your cards
        showPagination={false} // Pagination if relevant
      />
    );
  }
  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4">
        {/* <div className="flex flex-col gap-1 my-3">
          <h1 className="font-bold text-4xl">Department</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Overview of all the departments
          </h3>
        </div> */}

        <TokenMarketListCard />
      </div>
    </main>
  );
}
