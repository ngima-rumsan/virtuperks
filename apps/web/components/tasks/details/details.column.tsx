// import { useAcceptParticipantMutation } from "@/hooks/subgraph/querycall";
import { DialogButton } from "@/components/common/ui/dialog";
import { useAcceptParticipantMutation } from "@/hooks/subgraph/querycall";
import { getDialogContent } from "@/utils/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { CircleCheck, CircleX, Copy } from "lucide-react";
import { useState } from "react";

export function useColumns<T>(): ColumnDef<T>[] {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isRefetching, setIsRefetching] = useState(false);
 const acceptParticipantMutation = useAcceptParticipantMutation();
  const { toast } = useToast();

  const handleAction = (row: any) => {

    const entityId = row.original.rewardManagement.rewardManagement;

    const taskId = row.original.taskId;
   
    const status = row.getValue("status");
    const participant = row.getValue("participant");

    if (status === "PENDING") {
      setSelectedTask({ id: taskId, participant, status, entityId });
      setIsDialogOpen(true);
    } else if (status === "COMPLETED") {
      setSelectedTask({ id: taskId, participant, status });
      setIsDialogOpen(true);
    }
  };

  const handleDialogAction = async () => {
    if (selectedTask && selectedTask.status === "PENDING") {
      try {
        setIsRefetching(true);
        await acceptParticipantMutation.mutateAsync({
          taskId: selectedTask.id,
          participant: selectedTask.participant,
          entityId: selectedTask.entityId,
        });

        // Success Toast
        toast({
          title: "Participant accepted successfully!",
          variant: "success",
        });
        setIsDialogOpen(false);
        setSelectedTask(null);
      } catch (error) {
        console.error("Error accepting participant:", error);
        // Error Toast
        toast({
          title: "Failed to accept participant.",
          variant: "destructive",
        });
      }
    }
  };

  const LoadingBar = () =>
    acceptParticipantMutation.isPending ? (
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
    ) : null;

  return [
    {
      accessorKey: "participant",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Wallet Address</div>
      ),

      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              {row.getValue("participant")}
            </span>
            <Copy color="#94A3B8" size={16} strokeWidth={2.75} />
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Status</div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span
            className={`text-sm ${
              status === "COMPLETED"
                ? "text-green-600"
                : status === "UNACCEPTED"
                  ? "text-yellow-600"
                  : "text-gray-700"
            }`}
          >
            {row.getValue("status")}
          </span>
        );
      },
    },

    {
      id: "actions",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Action</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const status = row.getValue("status");
        const dialogContent = getDialogContent(status as string);

        if (status === "COMPLETED") {
          return null;
        }

        return (
          <>
            <span className="flex items-center gap-1">
              <CircleCheck
                color="#03AB65"
                strokeWidth={1.5}
                size={28}
                onClick={() => handleAction(row)}
                className="cursor-pointer"
              />
              <CircleX color="#E44134" strokeWidth={1.5} size={28} />
            </span>

            <DialogButton
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
              title={dialogContent.title}
              subTitle={dialogContent.subTitle}
              buttonName={
                acceptParticipantMutation.isPending
                  ? "Processing..."
                  : dialogContent.buttonName
              }
              handleApplyTaskLogic={handleDialogAction}
              isDisabled={acceptParticipantMutation.isPending}
            />
            <LoadingBar />
          </>
        );
      },
    },
  ];
}
