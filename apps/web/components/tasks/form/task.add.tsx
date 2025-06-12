"use client";

import { useTaskAdd } from "@/hooks/subgraph/task";
import { PATHS } from "@/routes/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@workspace/ui/components/card";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { isAddress, keccak256 } from "viem";
import { useWriteContract } from "wagmi";
import { TaskFormData, taskSchema } from "./schema";
import TaskBaseForm from "./task.form";

const defaultValues = {
  name: "",
  detailsUrl: "",
  owner: "",
  entityAddress: "",
  expiryDate: new Date(),
  rewardToken: process.env.NEXT_PUBLIC_RAHAT_TOKEN || "",
  totalRewardAmount: "",
  isOpen: true,
  isTokenDisbursed: false,
  requireApproval: true,
  isWhitelisted: true,
  maxParticipants: 0,
  whitelistedParticipants: [],
};

type TaskAddProps = {
  router: AppRouterInstance;
};

export default function TaskAdd({ router }: TaskAddProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema()),
    defaultValues: defaultValues,
  });
  const { toast } = useToast();

  const { writeContractAsync, isPending, isSuccess, isError, error } =
    useWriteContract();

  useEffect(() => {
    if (isError && error) {
      console.error("Transaction failed:", error);
    }
  }, [isError, error]);
  const { taskAdd, taskPending, taskSuccess } = useTaskAdd();

  const createTask = async (data: any) => {

    if (!isAddress(data.entityAddress)) {
      console.error("Invalid Ethereum address:", data.entityAddress);
      return;
    }
    const taskId = keccak256(data.name);
    

    const { detailsUrl, rewardToken, owner, isOpen, name } = data;
    const expiryDate = BigInt(
      Math.floor(new Date(data.expiryDate).getTime() / 1000),
    );
    const whitelistedParticipants = Array.isArray(data.whitelistedParticipants)
      ? data.whitelistedParticipants
      : [data.whitelistedParticipants];
    const totalRewardAmount = BigInt(data.totalRewardAmount);
    const maxParticipants = BigInt(data.maxParticipants);

    try {
      
      await taskAdd({
        taskId,
        name,
        detailsUrl,
        owner,
        entityAddress: data.entityAddress,
        expiryDate,
        rewardToken,
        totalRewardAmount: totalRewardAmount.toString(),
        isOpen,
        isTokenDisbursed: data.isTokenDisbursed,
        requireApproval: data.requireApproval,
        isWhitelisted: data.isWhitelisted,
        maxParticipants: maxParticipants.toString(),
        acceptedParticipantCount: 0, // Default to 0
        whitelistedParticipants: whitelistedParticipants || [],
        verfiedParticipants: [], // Default to empty array
      });

      // Success Toast
      toast({
        title: "Task Created Successfully!",
        variant: "success",
      });

      //navigate to
      router.push(PATHS.TASKS.HOME);
    } catch (err) {
      console.error("Failed to create task:", err);
      // Error Toast
      toast({
        title: "Task Creation Failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full items-center">
      <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
        <div
          onClick={() => router.push(PATHS.TASKS.HOME)}
          className="flex items-center gap-2 cursor-pointer hover:text-gray-400 my-3"
        >
          <ArrowLeft size={24} strokeWidth={2} />
          <span className="font-base text-gray-700">Back</span>
        </div>
        <div className="flex flex-col gap-1 my-2">
          <h1 className="font-bold text-4xl">Create Task</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Fill the form below to create a new task
          </h3>
        </div>

        <div className="my-6">
          <Card className="rounded-lg w-full">
            <CardContent className="p-0">
              <TaskBaseForm
                mode="add"
                form={form}
                defaultValues={defaultValues}
                saveForm={createTask}
                isPending={taskPending}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
