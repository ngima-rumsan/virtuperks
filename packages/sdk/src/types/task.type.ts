import { CommonFields } from "./common.type";
import { EntityTaskManagerCreated } from "./entity.type";
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
  rewardManagement?: EntityTaskManagerCreated;
  status: string;
  taskDetail: TaskDetail;
};

export interface TaskCreateParams {
  
  internal_id: string;        
  
  name: string;           
  detailsUrl: string;    
  owner: string;         
  expiryDate: number;     
  
  rewardToken: string;   
  totalRewardAmount: string;
  isOpen: boolean;
  isTokenDisbursed: boolean;
  
  requireApproval: boolean; 
  isWhitelisted: boolean;  
  
  maxParticipants: number;  
  acceptedParticipantCount: number;
  
  whitelistedParticipants?: string[];  
}
