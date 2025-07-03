import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import {
  useReadRewardManagementGetTask,
  useReadRewardManagementIsTaskExpired,
  useWriteRewardManagementCloseTask,
  useWriteRewardManagementCreateTask,
} from "../wagmi/contracts";

export const useTaskAdd = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteRewardManagementCreateTask();
  const { address, isConnected } = useAccount();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const verifiedParticipants = data.verifiedParticipants || [];

      const result = await writeContractAsync({
        address: data.entityAddress as `0x${string}`,
        args: [
          data.taskId,
          {
            name: data.name as string,
            detailsUrl: data.detailsUrl as string,
            owner: data.owner as `0x${string}`,
            expiryDate: BigInt(data.expiryDate),
            rewardToken: data.rewardToken as `0x${string}`,
            totalRewardAmount: BigInt(data.totalRewardAmount),
            isOpen: Boolean(data.isOpen),
            requireApproval: Boolean(data.requireApproval),
            isWhitelisted: Boolean(data.isWhitelisted),
            isTokenDisbursed: Boolean(data.isTokenDisbursed),
            maxParticipants: BigInt(data.maxParticipants),
            acceptedParticipantCount: BigInt(data.acceptedParticipantCount),
            verifiedParticipants:
              verifiedParticipants as readonly `0x${string}`[],
          },
          data.whitelistedParticipants,
        ],
      });
      return result;
    },
    onSuccess: (result, variable) => {},
  });
  return {
    taskAdd: mutation.mutateAsync,
    taskPending: mutation.isPending,
    taskSuccess: mutation.isSuccess,
  };
};

export const useGetAllTask = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["taskList"],
    queryFn: async () => {
      const taskDetail = await queryService?.getAllTasks();
      return taskDetail;
    },
    enabled: !!queryService,
  });
};

export const useOpenTask = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["openTasks"],
    queryFn: async () => {
      const taskDetail = await queryService?.getOpenTasks();
      return taskDetail;
    },
    enabled: !!queryService,
  });
};

export const useClosedTask = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["closedTasks"],
    queryFn: async () => {
      const taskDetail = await queryService?.getCloseTasks();
      return taskDetail;
    },
    enabled: !!queryService,
  });
};

export const useGetTaskById = (id: string) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["taskById", id],
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Subgraph query service is not initialized.");
      }
      const taskDetail = await queryService?.getTaskById(id);
      return taskDetail;
    },
    enabled: !!id && !!queryService,
  });
};

export const useCloseTaskMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync, isPending, isSuccess } =
    useWriteRewardManagementCloseTask();

  return useMutation({
    mutationFn: async ({
      taskId,
      entityId,
    }: {
      taskId: string;

      entityId: string;
    }) => {
      const result = await writeContractAsync({
        address: (entityId as `0x${string}`) || "0x",
        args: [taskId as `0x${string}`],
      });

      return result;
    },

    onSuccess: async (result, variable) => {
      // await new Promise((resolve) => setTimeout(resolve, 9000));
      // await queryClient.invalidateQueries({
      //   queryKey: ["AllParticipantsStatus", variable.taskId],
      // });
    },
  });
};

// to check wheter the task is expired or not

export const useCheckTaskStatus = (taskId: string, entityId: string) => {
  const {
    data: taskStatus,
    isError,
    isLoading,
  } = useReadRewardManagementGetTask({
    address: entityId as `0x${string}`,
    args: [taskId as `0x${string}`],
  });
  console.log(taskStatus, "taskStatus from hook");

  return {
    status: taskStatus?.isTokenDisbursed,
    isError,
    statusLoading: isLoading,
  };
};

export const useIsTaskExpired = (taskId: string, entityId: string) => {
  const {
    data: status,
    isError,
    isLoading,
  } = useReadRewardManagementIsTaskExpired({
    address: entityId as `0x${string}`,
    args: [taskId as `0x${string}`],
  });

  return {
    status,
    isError,
    statusLoading: isLoading,
  };
};
