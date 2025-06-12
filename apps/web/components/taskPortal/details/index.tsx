import { CustomAlertDialog } from "@/components/common/ui/alert.dialog";
import { DialogButton } from "@/components/common/ui/dialog";
import { Cuid } from "@/components/departments/details/details.main";
// import {
//   useCompleteTaskMutation,
//   useGetParticipantTaskStatus,
//   useParticipateTaskMutation,
// } from "@/hooks/subgraph/querycall";
import {
  useCheckParticipantStatus,
  useCompleteTaskMutation,
  useParticipateTaskMutation,
} from "@/hooks/subgraph/querycall";
import { useGetTaskById } from "@/hooks/subgraph/task";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useAccount } from "wagmi";
import TaskPortalParticipant from "./details.participant";
import TaskPortalDetails from "./details.task";

type TaskPortalMainProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

const TaskPortalMain = ({ cuid, router }: TaskPortalMainProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [localButtonState, setLocalButtonState] = useState<string | null>(null);

  const { isConnected, address } = useAccount();

  const getTaskDetail = useGetTaskById(cuid.id);

  const { toast } = useToast();
  const taskData = getTaskDetail?.data?.data?.taskCreated;
  console.log("Task Data: ", taskData);

  const { participateTask, participatePending, participateSuccess } =
    useParticipateTaskMutation();
  const { completeTask, completePending } = useCompleteTaskMutation();

  const { status: participantStatus, isLoading: statusLoading } =
    useCheckParticipantStatus(
      taskData?.internal_id,
      taskData?.rewardManagement?.rewardManagement,
    );

  console.log("Participant Status: ", participantStatus);
  const handleApplyTask = () => {
    if (isConnected) {
      setIsOpen(true);
    } else {
      setAlertDialog(true);
    }
  };

  const handleTask = () => {
    if (isConnected) {
      setIsOpen(true);
    } else {
      setAlertDialog(true);
    }
  };

  // const handleApplyTaskLogic = async () => {
  //   return new Promise<void>((resolve, reject) => {
  //     participateTask(
  //       {
  //         taskId: taskData?.internal_id,
  //         entityId: taskData?.rewardManagement?.rewardManagement || "0x",
  //       },
  //       {
  //         onSuccess: () => {
  //           setIsOpen(false);
  //           setLocalButtonState("UNACCEPTED");
  //           toast({
  //             title: "Task Application Submitted Successfully!",
  //             variant: "success",
  //           });
  //           resolve();
  //         },
  //         onError: (error) => {
  //           console.error("Error applying for task:", error);
  //           toast({
  //             title: "Failed To Apply For Task. Please Try Again.",
  //             variant: "destructive",
  //           });
  //           reject(error);
  //         },
  //       },
  //     );
  //   });
  // };

  const handleApplyTaskLogic = async () => {
    // Optimistically update status

    return new Promise<void>((resolve, reject) => {
      participateTask(
        {
          taskId: taskData?.internal_id,
          entityId: taskData?.rewardManagement?.rewardManagement || "0x",
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            setLocalButtonState("WAITING");
            toast({
              title: "Task Application Submitted Successfully!",
              variant: "success",
            });
            resolve();
          },
          onError: (error) => {
            console.error("Error applying for task:", error);
            setLocalButtonState(null); // Rollback
            toast({
              title: "Failed To Apply For Task. Please Try Again.",
              variant: "destructive",
            });
            reject(error);
          },
        },
      );
    });
  };

  // const handleCompletedTask = async (data: any) => {
  //   return new Promise<void>((resolve, reject) => {
  //     completeTask(
  //       {
  //         taskId: taskData.internal_id,
  //         entityId: taskData?.rewardManagement?.rewardManagement || "0x",
  //         completionUrl: data.completionUrl,
  //       },
  //       {
  //         onSuccess: () => {
  //           setIsOpen(false);
  //           setLocalButtonState("COMPLETED");
  //           resolve();
  //         },
  //         onError: (error) => {
  //           console.error("Error completing task:", error);
  //           reject(error);
  //         },
  //       },
  //     );
  //   });
  // };

  const handleCompleteTask = () => {
    if (isConnected) {
      setIsOpen(true);
    } else {
      setAlertDialog(true);
    }
  };

  const handleCompletedTask = async (data: any) => {
    return new Promise<void>((resolve, reject) => {
      completeTask(
        {
          taskId: taskData.internal_id,
          entityId: taskData?.rewardManagement?.rewardManagement || "0x",
          completionUrl: data.completionUrl,
        },

        {
          onSuccess: () => {
            setIsOpen(false);
            setLocalButtonState("COMPLETED");
            resolve();
          },
          onError: (error) => {
            console.error("Error completing task:", error);
            setLocalButtonState("ACCEPTED"); // Rollback
            reject(error);
          },
        },
      );
    });
  };

  const getDialogHandler = () => {
    switch (localButtonState) {
      case "COMPLETED":
        return undefined;
      case "WAITING":
        return undefined;
      case "VERIFIED":
        return undefined;
      default:
        return handleApplyTaskLogic;
    }
  };

  const getButtonContent = () => {
    if (statusLoading) return <Button disabled>Loading...</Button>;

    const effectiveStatus = localButtonState ?? participantStatus;

    switch (effectiveStatus) {
      case "Waiting":
      case 0:
        return (
          <Button
            className="bg-[#297AD6]"
            onClick={handleApplyTask}
            disabled={participatePending}
          >
            <span className="text-[#F8FAFC]">
              {participatePending ? "Processing..." : "Apply for task"}
            </span>
            {!participatePending && (
              <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
            )}
          </Button>
        );

      case "WAITING":
      case 1:
        return (
          <Button className="bg-[#F59E0B]" disabled>
            <span className="text-[#F8FAFC]">Waiting for Acceptance</span>
          </Button>
        );

      case "ACCEPTED":
      case 2:
        return (
          <Button
            className="bg-green-500 disabled:bg-green-500"
            onClick={handleCompleteTask}
          >
            <span className="text-[#F8FAFC]">
              {completePending ? "Processing..." : "Mark as complete"}
            </span>
          </Button>
        );

      case "COMPLETED":
      case 3:
        return (
          <Button
            className="bg-green-500 disabled:bg-green-500"
            disabled={true}
          >
            <span className="text-[#F8FAFC]">{"Completed"}</span>
          </Button>
        );

      case "VERIFIED":
      case 4:
        return (
          <Button className="bg-green-500 disabled:bg-blue-500" disabled={true}>
            <span className="text-[#F8FAFC]">{"Verified"}</span>
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4">
        <div
          onClick={() => router.push(PATHS.TASKPORTAL.HOME)}
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
            {getButtonContent()}
          </div>
        </div>

        {alertDialog ? (
          <CustomAlertDialog
            alertDialog={alertDialog}
            setAlertDialog={setAlertDialog}
            textData="Connect your wallet first"
          />
        ) : isOpen ? (
          <>
            {participantStatus === 0 && (
              <DialogButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Are you sure you want to apply for this task?"
                subTitle="This action cannot be undone"
                buttonName="Apply"
                handleApplyTaskLogic={handleApplyTaskLogic}
                submitType="Apply"
                isDisabled={participatePending}
              />
            )}
            {participantStatus === 2 && (
              <DialogButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Are you sure you want to mark this task as completed?"
                subTitle="This action cannot be undone"
                buttonName="Complete"
                handleApplyTaskLogic={handleCompletedTask}
                submitType="complete"
                isDisabled={completePending}
              />
            )}
          </>
        ) : null}

        <div className="flex w-full gap-4">
          <TaskPortalDetails taskData={taskData} />
        </div>

        <div className="flex w-full gap-4">
          <TaskPortalParticipant taskId={cuid} />
        </div>
      </div>
    </main>
  );
};

export default TaskPortalMain;
