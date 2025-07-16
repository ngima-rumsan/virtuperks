import { VirtueperkCommonField } from "./common.type";
import { Redemption } from "./redemption.type";


export type RewardBase = {
  name: string;
  appId: string;
  rewardManagement: string;
  registry: string;
  entityId: string;
  isActive: boolean;

  redemptions?: Redemption[]; 
}

export type Reward = RewardBase & VirtueperkCommonField;
export type CreateReward = RewardBase;
export type EditReward = Partial<CreateReward>;
