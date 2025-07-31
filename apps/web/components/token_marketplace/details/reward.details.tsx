"use client";

import { useCheckParticipantBalance } from "@/hooks/subgraph/token";
import {
  useApproveReward,
  useGetRedeemedRewardByParticiant,
  useGetRewardById,
  useGetRewardOwner,
  useRedeemReward,
} from "@/hooks/subgraph/token-marketplace";
import { Coins } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { categoryColorMap } from "../img/imgLink";
import RedemptionHistory from "./redemption.history";

type Step = "approve" | "redeem" | "completed";

export interface RewardDetailsProps {
  rewardId: string;
  router: AppRouterInstance;
}

const RewardDetails = ({ rewardId, router }: RewardDetailsProps) => {
  const { data: rewardDetail, isLoading, error } = useGetRewardById(rewardId);
  const { address, isConnected } = useAccount();
  //hook to check participant balance
  const { participantTotalToken, isError } = useCheckParticipantBalance(
    address as `0x${string}`,
  );
  // hookto get redeemed rewards by participant
  const getParticipantReward = useGetRedeemedRewardByParticiant(
    address as `0x${string}`,
  );
  const redeemedRewardsByParticipant =
    getParticipantReward?.data?.data?.rewardRedeemeds || [];

  const [step, setStep] = useState<Step>("approve");
  const [loading, setLoading] = useState(false);
  const [approvalHash, setApprovalHash] = useState<string | null>(null);

  // hook to fetch redeemed rewards with status

  const [redeemTxHash, setRedeemTxHash] = useState<string | null>(null);
  const { ApproveReward, ApprovePending } = useApproveReward();
  const { RewardRedeem, RedeemPending } = useRedeemReward();

  const { getRewardOwner } = useGetRewardOwner(rewardId);

  if (isLoading)
    return <p className="p-6 text-gray-500">Loading reward details...</p>;

  if (error || !rewardDetail?.data) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">
          Failed to load reward details.
        </p>
        <button
          onClick={() => router.push("/token_marketplace")}
          className="text-blue-600 text-sm mt-2"
        >
          &larr; Back to Marketplace
        </button>
      </div>
    );
  }

  const rewardRaw = rewardDetail?.data?.rewardRedemptionCreateds[0];

  const handleApprove = async () => {
    try {
      const txHash = await ApproveReward({
        rewardAddress: rewardRaw.rewardRedemption,
        value: rewardRaw.tokensRequired,
      });
      setApprovalHash(txHash);
      setStep("redeem");
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleRedeem = async () => {
    try {
      const txHash = await RewardRedeem({
        rewardAddress: rewardRaw.rewardRedemption,
      });
      setRedeemTxHash(txHash);
      setStep("completed");
    } catch (err) {
      console.error("Redeem failed:", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/token_marketplace")}
        className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
      >
        &larr; Back to Marketplace
      </button>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Section */}
        <div className="flex-[2] border border-gray-200 rounded-lg p-5 bg-white">
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-5">
            {/* <img
              src={getImageForTitle(rewardRaw.name)}
              alt={rewardRaw.name}
              className="object-cover h-full w-full rounded-lg"
            /> */}

            <Image
              src={
                categoryColorMap[rewardRaw.category]?.image ??
                "https://assets.rumsan.net/rumsan-test/virtualperks-tokenmanagement-defaultimg.jpg"
              }
              alt={rewardRaw.name}
              width={400}
              height={300}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Title: {rewardRaw.name}
          </h2>
          <p className="text-gray-600 mb-4">Reward Owner ID: </p>
          <p>{getRewardOwner}</p>
          <div className="text-gray-600 mb-4 flex items-center gap-2">
            <span>Token:</span>
            <span className="text-blue-600 flex items-center gap-1">
              {rewardRaw.tokensRequired}
              <Coins size={18} strokeWidth={2.65} />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-2">
            <div>
              <p className="font-medium">Validity</p>
              <p>6 months from redemption</p>
            </div>
            <div>
              <p className="font-medium">Rules & Regulations</p>
              <ul className="list-disc list-inside">
                <li>Non-transferable and cannot be exchanged for cash.</li>
                <li>Valid only within the redemption period.</li>
                <li>Subject to availability and venue policies.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-[1] flex">
          <div className="w-full border border-gray-200 shadow-sm rounded-xl p-4 bg-white mx-auto flex flex-col justify-between h-[50%] md:h-auto md:self-start">
            {/* Available Tokens Section */}
            <div className="mb-4 p-3 text-center border-b border-gray-300">
              <p className="text-sm font-semibold text-gray-500 mb-1">
                Available Tokens
              </p>
              <div className="flex justify-center items-center text-blue-700 text-2xl font-bold gap-2">
                {participantTotalToken ?? 0} <Coins size={24} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-1">
              Token Required to Redeem
            </h3>
            <div className="text-blue-600 text-2xl font-bold text-center my-2 flex items-center justify-center gap-2">
              {rewardRaw.tokensRequired} <Coins size={24} strokeWidth={2.65} />
            </div>

            <p className="text-[11px] text-gray-500 text-center mt-1">
              By redeeming, you agree to the terms.
            </p>

            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700 text-center min-h-[130px] flex flex-col justify-between">
              {/* Step 1: Approve */}
              {step === "approve" && (
                <div className="p-2 mt-3 text-sm text-center min-h-[130px] flex flex-col justify-between">
                  <p className="font-semibold mb-1">
                    Please approve token spending to continue.
                  </p>
                  <button
                    onClick={handleApprove}
                    disabled={ApprovePending}
                    className={`py-1.5 px-3 rounded-lg text-sm font-medium transition text-white ${
                      ApprovePending
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {ApprovePending
                      ? "Approving... Please confirm in wallet"
                      : "Step 1: Approve Token Spending"}
                  </button>
                </div>
              )}

              {/* Approval Success */}
              {step === "redeem" && approvalHash && (
                <>
                  <div>
                    Approval successful! You can now redeem the reward.
                    <div className="text-gray-500 text-[10px] break-all mt-1">
                      {approvalHash}
                    </div>
                  </div>
                  <button
                    onClick={handleRedeem}
                    disabled={RedeemPending}
                    className={`mt-2 py-1.5 px-3 rounded-lg text-sm font-medium transition text-white ${
                      RedeemPending
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {RedeemPending ? "Redeeming..." : "Step 2: Redeem Reward"}
                  </button>
                </>
              )}

              {/* Completed */}
              {step === "completed" && (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <p>
                      Redemption successful! Your reward will be processed
                      shortly.
                    </p>
                    {redeemTxHash && (
                      <p className="text-green-700 text-xs mt-1 break-all">
                        {redeemTxHash}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setStep("approve");
                      setApprovalHash(null);
                      setRedeemTxHash(null);
                    }}
                    className="mt-2 py-1.5 px-3 rounded-lg text-sm font-medium transition text-white bg-gray-700 hover:bg-gray-800"
                  >
                    Redeem Another Reward
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Redemption History */}
      <RedemptionHistory rewardId={rewardId} />
    </div>
  );
};

export default RewardDetails;
