import { CommonFields } from "./common.type";
import { RewardManagementCreated } from "./entity.type";
import { TaskDetail } from "./taskDetail.type";

export interface AcceptedTaskData extends CommonFields {
  participant?: string;
  status?: string;
  taskDetail: TaskDetail & {
    allowedWallets: string[];
    __typename: string;
  };
}

export type TaskCreated = CommonFields & {
  rewardManagement?: RewardManagementCreated;
  status: string;
  taskDetail: TaskDetail;
};

export interface TaskCreateParams {
  taskId: `0x${string}`; 
  name: string;
  detailsUrl: string;
  owner: string;
  expiryDate: bigint;
  entityAddress: string;

  rewardToken: string;
  totalRewardAmount: string;
  isOpen: boolean;
  isTokenDisbursed: boolean;

  requireApproval: boolean; 
  isWhitelisted: boolean;

  maxParticipants: bigint; 
  acceptedParticipantCount: number; 

  verifiedParticipants?: string[]; 
  whitelistedParticipants?: string[];
}

export interface CompleteTaskParams {
  taskId?: `0x${string}`; 
  completionUrl: string;
  amount?: string;
  to?: string;
  remarks?: string;
}

export interface DisburseDialogData {
  amount: number;
}


