export type TaskDetail = {
  allowedWallets: string[];
  name: string;
  detailsUrl: string;
  expiryDate: number;
  id: string;
  isOpen: boolean;
  maxParticipants: number;
  owner: string;
  totalRewardAmount: string;
  rewardToken: string;
  isTokenDisbursed: boolean;
  requireApproval: boolean;
};
