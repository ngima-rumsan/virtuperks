import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useGraphService } from "@/providers/subgraph-provider";
import { useAccount } from "wagmi";
import {
  useReadRewardManagementGetParticipantStatus,
  useWriteRewardManagementAcceptParticipant,
  useWriteRewardManagementCompleteTask,
  useWriteRewardManagementParticipate,
} from "../wagmi/contracts";

export const useCheckParticipantStatus = (taskId: string, entityId: string) => {
  const { address } = useAccount();
  const {
    data: status,
    isError,
    isLoading,
  } = useReadRewardManagementGetParticipantStatus({
    address: entityId as `0x${string}`,
    args: [taskId as `0x${string}`, address as `0x${string}`],
  });

  return {
    status,
    isError,
    isLoading,
  };
};

export const useParticipateTaskMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteRewardManagementParticipate();
  const { address: participant } = useAccount();

  const mutation = useMutation({
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
    onSuccess: (result, variable) => {
      if (participant) {
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["participantTaskStatus", participant, variable.taskId],
          });
        }, 5000);
      }
    },
  });
  return {
    participateTask: mutation.mutateAsync,
    participatePending: mutation.isPending,
    participateSuccess: mutation.isSuccess,
  };
};

export const useCompleteTaskMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteRewardManagementCompleteTask();
  const { address: participant } = useAccount();

  const mutation = useMutation({
    mutationFn: async ({
      taskId,
      entityId,
      completionUrl,
    }: {
      taskId: string;
      entityId: string;
      completionUrl?: string;
    }) => {
      // 🔍 Log inputs
      // console.log("🔁 Task Completion Mutation Triggered");
      // console.log("taskId:", taskId);
      // console.log("entityId:", entityId);
      // console.log("completionUrl:", completionUrl);
      const result = await writeContractAsync({
        address: (entityId as `0x${string}`) || "0x",
        args: [taskId as `0x${string}`, completionUrl || ""],
      });
      return result;
    },
    onSuccess: (result, variable) => {
      if (participant) {
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["participantTaskStatus", participant, variable.taskId],
          });
        }, 5000);
      }
    },
  });
  return {
    completeTask: mutation.mutateAsync,
    completePending: mutation.isPending,
    completeSuccess: mutation.isSuccess,
  };
};

// export const useGetParticipantStatusByTask = (taskId: string) => {
//  const { queryService } = useGraphService();

//     return useQuery({
//       queryKey: ["participantStatus", taskId],
//       queryFn: async () => {
//         const taskDetail =
//           await queryService?.getParticipantStatusByTask(taskId);
//         return taskDetail;
//       },
//       enabled: !!taskId
//     });
// };
// import { useMutation } from "@tanstack/react-query";

// export const useTokenMint = () => {
//   const { writeContractAsync } = useWriteRewardTokenMint();

//   const token = process.env.NEXT_PUBLIC_RAHAT_TOKEN as `0x${string}`;
//   const mutation = useMutation({
//     mutationFn: async ({
//       address,
//       amount,
//     }: {
//       address: string;
//       amount: number;
//     }) => {
//       const result = await writeContractAsync({
//         address: token,
//         args: [address as `0x${string}`, BigInt(amount)],
//       });

//       return result;
//     },
//   });
//   return {
//     tokenMint: mutation.mutateAsync,
//     mintPending: mutation.isPending,
//     mintSuccess: mutation.isSuccess,
//     mintError: mutation.isError,
//   };
// };
export const useGetParticipantPending = (taskId: any) => {
  const { queryService } = useGraphService();

  const { data, isLoading } = useQuery({
    queryKey: ["participantsPending", taskId],
    queryFn: async () => {
      const getAllData =
        await queryService?.getPendingParticipantsByTask(taskId);
      return getAllData;
    },
    enabled: !!taskId,
  });

  const filterData = data?.data?.participantTaskStatuses || [];

  return {
    pendingParticipants: filterData,
    taskParticipantsWithStatusLoading: isLoading,
  };
};

export const useGetParticipantAccepted = (taskId: any) => {
  const { queryService } = useGraphService();

  const { data, isLoading } = useQuery({
    queryKey: ["acceptedParticipants", taskId],
    queryFn: async () => {
      const getAllData =
        await queryService?.getAcceptedParticipantsByTask(taskId);
      return getAllData;
    },
    enabled: !!taskId,
  });

  const filterData = data?.data?.participantTaskStatuses || [];

  return {
    acceptedParticipants: filterData,
    acceptedParticipantsLoading: isLoading,
  };
};

export const useAcceptParticipantMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync, isPending, isSuccess } =
    useWriteRewardManagementAcceptParticipant();

  return useMutation({
    mutationFn: async ({
      taskId,
      participant,
      entityId,
    }: {
      taskId: string;
      participant: string;
      entityId: string;
    }) => {
      const result = await writeContractAsync({
        address: (entityId as `0x${string}`) || "0x",
        args: [taskId as `0x${string}`, participant as `0x${string}`],
      });

      return result;
    },

    onSuccess: async (result, variable) => {
      await new Promise((resolve) => setTimeout(resolve, 9000));
      await queryClient.invalidateQueries({
        queryKey: ["cceptedParticipants", variable.taskId],
      });
    },
  });
};
