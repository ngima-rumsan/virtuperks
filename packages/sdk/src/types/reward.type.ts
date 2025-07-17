import { VirtueperkCommonField } from "./common.type";
import { Redemption } from "./redemption.type";


export type  RewardBase  = {

  title: string;
  description: string;
  tokens: number;
  category?: string;
  isActive: boolean;
  imageUrl?: string;
  stock?: number;

  redemptions?: Redemption[]; 
}

export type Reward = RewardBase & VirtueperkCommonField
export type CreateReward = RewardBase
export type EditReward= Partial<CreateReward>