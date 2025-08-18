"use client";

import { DialogButton } from "@/components/common/ui/dialog";
import {
  useCheckTotalAllocatedTokens,
  useCheckTotalUnallocatedTokens,
  useGetEntityById,
  useGetEntityOwners,
} from "@/hooks/subgraph/entity";
import { useDirectTokenTransfer } from "@/hooks/subgraph/token";
import { PATHS } from "@/routes/paths";
import hasRole from "@/utils/role";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/hooks/use-toast";
import { Copy, Loader2, Plus, User } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { Cuid } from "./details.main";

type DepartmentDetailsCardProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

export default function DepartmentDetailsCard({
  cuid,
  router,
}: DepartmentDetailsCardProps) {
  const { data: entity, isLoading, isError, error } = useGetEntityById(cuid.id);

  const { unallocatedTokens } = useCheckTotalUnallocatedTokens(
    entity?.rewardManagement,
  );

  const { totalAllocatedTokens } = useCheckTotalAllocatedTokens(
    entity?.rewardManagement,
  );

  const { getEntityOwners } = useGetEntityOwners(entity?.entityId);

  const roleData = hasRole({ role: process.env.NEXT_PUBLIC_MINTER_ROLE! });
  const canAllocateToken = Boolean(roleData);

  const {
    directTransfer,
    directTransferPending,
    directTransferSuccess,
    directTransferError,
  } = useDirectTokenTransfer();

  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return <p className="text-gray-600">Loading department info...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600">Failed to load department: {error.message}</p>
    );
  }

  if (!entity) {
    return (
      <p className="text-red-600">
        Department data is not available or could not be found.
      </p>
    );
  }

  const handleDialogAction = async (data: any) => {
    try {
      await directTransfer({
        to: data.to,
        amount: data.amount,
        remarks: data.remarks,
        entityId: entity.rewardManagement,
      });
      setIsOpen(false);
      toast({
        title: "Token transfered Successfully!.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error approving transfering token:", error);
      toast({
        title: "Failed To transfer token. Please Try Again.",
        variant: "destructive",
      });
    }
  };

  const getTransferButton = () => (
    <Button
      variant="outline"
      className="h-12 w-48 flex items-center justify-center"
      style={{
        border: "1px solid #03AB65",
      }}
      disabled={directTransferPending}
      onClick={() => !directTransferPending && setIsOpen(true)}
    >
      <span className="text-[#03AB65] flex items-center gap-2">
        {directTransferPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus size={16} strokeWidth={2.75} />
        )}
        {directTransferPending ? "Processing..." : "Transfer Token"}
      </span>
    </Button>
  );

  return (
    <>
      <div className="flex flex-col gap-1 my-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl">{entity.name}</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Detailed view of the selected department
            </h3>
          </div>
          <div className="flex gap-10">
            {getTransferButton()}

            {!directTransferPending && (
              <DialogButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Are you sure you want to transfer token amount?"
                subTitle="This action cannot be undone"
                buttonName={
                  directTransferPending ? "Processing..." : "Transfer Token"
                }
                submitType="directdisburse"
                handleApplyTaskLogic={handleDialogAction}
              />
            )}

            {canAllocateToken && (
              <Button
                className="h-12 w-48 fw-[600] flex items-center justify-center"
                variant="default"
                type="button"
                onClick={() =>
                  router.push(PATHS.TREASURER.CREATE(entity.rewardManagement))
                }
              >
                <Plus size={22} strokeWidth={2.75} />
                <span className="ml-2">Allocate Token</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 mt-4 gap-4 w-full">
        <Card className="font-normal text-base h-50 flex flex-col p-4">
          <CardTitle className="flex items-center gap-3">
            <div className="rounded-full flex p-3 bg-[#475263] mb-auto">
              <User color="#fff" />
            </div>
            <CardDescription className="flex flex-col gap-2">
              <div className="flex flex-col items-start gap-2">
                <div className="flex flex-start text-[#334155] text-xl justify-start">
                  {entity.name}
                </div>
                {getEntityOwners && getEntityOwners.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[#475569] font-medium text-sm">
                      {getEntityOwners.length === 1
                        ? "Department Owner"
                        : "Department Owners"}
                    </span>
                    <div className="flex flex-col gap-1 text-sm text-[#64748B]">
                      {getEntityOwners.map((owner: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">
                            {owner}
                          </span>
                          <Copy
                            size={16}
                            strokeWidth={2}
                            className="cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(owner);
                              toast({
                                title: "Copied to clipboard!",
                                variant: "success",
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardDescription>
          </CardTitle>
        </Card>

        <Card className="font-normal text-base h-50 flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="flex p-0 mb-4 text-[#0F172A]">
              Total Tokens Allocated
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {totalAllocatedTokens ?? "-"}
          </CardFooter>
        </Card>
        <Card className="font-normal text-base h-50 flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="flex p-0 mb-4 text-[#0F172A]">
              Total Tokens Available
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {unallocatedTokens ?? "-"}
          </CardFooter>
        </Card>
        <Card className="font-normal text-base h-50 flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="flex p-0 mb-4 text-[#0F172A]">
              Total Tokens Redeemed
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            -
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
