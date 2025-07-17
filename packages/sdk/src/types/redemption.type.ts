import { VirtueperkCommonField } from "./common.type";
import { RedemptionStatus } from "./enums";


export type  RedemptionBase = {

  userAddress: string;
  rewardId: string;
  tokens: number;
  transactionHash?: string;
  status: RedemptionStatus;
  taskId?: string;
  
}


export type Redemption = RedemptionBase & VirtueperkCommonField

export type CreateRedemption = RedemptionBase
export  type EditRedemption = Partial<CreateRedemption>