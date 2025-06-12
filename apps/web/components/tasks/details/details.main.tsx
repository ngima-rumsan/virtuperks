import { Cuid } from "@/components/departments/details/details.main";
// import {
//   useApproveTaskMutation,
//   useGetApprovedAndCompletedList,
// } from "@/hooks/subgraph/querycall";
import { DialogButton } from "@/components/common/ui/dialog";
import { useGetTaskDetailById } from "@/hooks/subgraph/taskDetail";
import { useDisburseTokenToTask } from "@/hooks/subgraph/token";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { ArrowLeft, CheckCircle, CircleX } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useAccount } from "wagmi";
import TaskParticipant from "./details.participant";
import TaskDetails from "./details.task";

type TaskMainProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

const TaskMain = ({ cuid, router }: TaskMainProps) => {
  const getTaskDetail = useGetTaskDetailById(cuid.id);
  console.log("HEllo: ", getTaskDetail.data?.data.taskCreated);
  const taskData = getTaskDetail.data?.data.taskCreated;

  const { toast } = useToast();
  // const { completedData, approvedData } = useGetApprovedAndCompletedList(
  //   cuid.id,
  // );
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [localButtonState, setLocalButtonState] = useState<string | null>(null);
  const { isConnected, address } = useAccount();
  const [disbursed, setDisbursed] = useState(false);

  const {
    disburseTokenToTask,
    disbursePending,
    disburseSuccess,
    disburseError,
  } = useDisburseTokenToTask();

  const handleDisperseToken = () => {
    if (isConnected) {
      setIsOpen(true);
    } else {
      setAlertDialog(true);
    }
  };

  const handleDisperse = () => {
    if (isConnected) {
      setIsOpen(true);
    } else {
      setAlertDialog(true);
    }
  };

  // const approveTask = useApproveTaskMutation();

  // const getApproveButtonState = () => {
  // If approved data exists, show approved state
  // if (
  //   (approvedData && approvedData.length > 0) ||
  //   localStatus === "VERIFIED"
  // ) {
  //   return {
  //     className: "border border-[#03AB65] bg-[#03AB65]",
  //     text: "Verified",
  //     disabled: true,
  //     onClick: undefined,
  //   };
  // }
  // If completed data exists but not approved, enable approve button
  // if (completedData && completedData.length > 0) {
  //   return {
  //     className: "border border-[#03AB65]",
  //     text: approveTask.isPending ? "Processing..." : "Approve",
  //     disabled: approveTask.isPending,
  //     onClick: () => setIsOpen(true),
  //   };
  // }
  // If neither exists, disable approve button
  // return {
  //   className: "border border-[#03AB65]",
  //   text: "Approve",
  //   disabled: true,
  //   onClick: undefined,
  // };
  // };

  // const handleDialogAction = async () => {
  //   try {
  //     await approveTask.mutateAsync({
  //       taskId: cuid.id,
  //       entityId: taskData.entityTaskManager.entityTaskManager,
  //     });
  //     setIsOpen(false);
  //     setLocalStatus("VERIFIED"); // Update local status immediately after successful approval
  //     toast({
  //       title: "Task Approved Successfully!.",
  //       variant: "success",
  //     });
  //   } catch (error) {
  //     console.error("Error approving task:", error);
  //     toast({
  //       title: "Failed To Approve Task. Please Try Again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleDisburseToken = async () => {
    try {
      await disburseTokenToTask({
        taskId: cuid.id,
        amount: 0,
        entityId: taskData.internal_id,
      });
      setDisbursed(true);
      toast({
        title: "Tokens Disbursed Successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Disbursement Error:", error);
      toast({
        title: "Failed to Disburse Tokens. Please Try Again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4">
        <div
          onClick={() => router.push(PATHS.TASKS.HOME)}
          className="flex items-center gap-2 cursor-pointer hover:text-gray-400 my-3"
        >
          <ArrowLeft size={24} strokeWidth={2} />
          <span className="font-base text-gray-700">Back</span>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-4xl">Task Details</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Detailed view of the selected task
            </h3>
          </div>
          <div className="flex items-center ml-auto gap-4">
            <Button
              variant="outline"
              onClick={handleDisburseToken}
              disabled={disbursePending || disbursed}
              style={{
                border: "1px solid #03AB65",
                opacity: disbursePending || disbursed ? 0.6 : 1,
                cursor:
                  disbursePending || disbursed ? "not-allowed" : "pointer",
              }}
            >
              <span style={{ color: "#03AB65" }}>
                {disbursePending
                  ? "Processing..."
                  : disbursed
                    ? "Disbursed"
                    : "Disburse Tokens"}
              </span>{" "}
              <CheckCircle
                style={{
                  color: "#03AB65",
                  strokeWidth: 2.5,
                  width: "20px",
                  height: "20px",
                }}
              />
            </Button>

            <DialogButton
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title="Are you sure you want to disperse token for this participant?"
              subTitle="This action cannot be undone"
              buttonName="disperse"
              handleApplyTaskLogic={handleDisburseToken}
              submitType="disperse"
              isDisabled={disbursePending || disbursed}
            />

            <Button variant="outline" className="border border-[#E44134]">
              <span className="text-[#E44134]">Close</span>{" "}
              <CircleX color="#E44134" strokeWidth={2.5} size={20} />
            </Button>
            {/* {!approveTask.isPending && isOpen && (
              <DialogButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Are you sure you want to approve this task?"
                subTitle="This action cannot be undone"
                buttonName="Approve"
                handleApplyTaskLogic={handleDialogAction}
              />
            )} */}
          </div>
        </div>

        <div className="flex w-full gap-4">
          <TaskDetails cuid={cuid} />
        </div>

        <div className="flex w-full gap-4">
          <TaskParticipant taskId={cuid} />
        </div>
      </div>
    </main>
  );
};

export default TaskMain;
function setDisbursed(arg0: boolean) {
  throw new Error("Function not implemented.");
}
