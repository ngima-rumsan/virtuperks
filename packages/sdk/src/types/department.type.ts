import { TaskCreated } from "./task.type";

export interface DepartmentDetails {
  registry: string;            
  blockNumber: number;         
  blockTimestamp: number;     
  id: string;                 
  transactionHash: string;     
  totalAvailableTokens?: string; 
  totalMintedTokens?: string;    
  __typename: string;
  appId: string;               
  name: string;
  entityId: string;            
  tasks: TaskCreated[];
  rewardManagement: string;   
}
