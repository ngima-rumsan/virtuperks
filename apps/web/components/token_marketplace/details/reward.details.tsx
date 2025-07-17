"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";

type RedemptionStatus = "completed" | "pending";

interface Redemption {
  name: string;
  date: string;
  status: RedemptionStatus;
  txnId: string;
}

interface Reward {
  id: number;
  title: string;
  description: string;
  tokens: number;
  category: string;
  image: string;
}

interface RewardDetailsProps {
  rewardId: string;
  router: AppRouterInstance;
}

const RewardDetails = ({ rewardId, router }: RewardDetailsProps) => {
  const rewards: Reward[] = [
    {
      id: 1,
      title: "Movie Ticket",
      description:
        "Premium cinema experience with comfortable seating and latest sound technology",
      tokens: 20,
      category: "Entertainment",
      image: "https://assets.rumsan.net/rumsan-test/cinema-ticket.jpg",
    },
    {
      id: 2,
      title: "Coffee",
      description: "Premium coffee blend",
      tokens: 150,
      category: "Food & Beverage",
      image: "https://assets.rumsan.net/rumsan-test/coffee-.jpg",
    },
    {
      id: 3,
      title: "Mobile TopUp",
      description: "Mobile recharge service",
      tokens: 200,
      category: "Utilities",
      image: "https://assets.rumsan.net/rumsan-test/mobile-topup.png",
    },
    {
      id: 4,
      title: "Gift Card",
      description: "Universal gift voucher",
      tokens: 1000,
      category: "Shopping",
      image: "https://assets.rumsan.net/rumsan-test/gift-card.jpg",
    },
  ];

  const [reward, setReward] = useState<Reward | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  useEffect(() => {
    const selectedReward = rewards.find((r) => r.id === Number(rewardId));
    setReward(selectedReward || null);

    setRedemptions([
      {
        name: "Wallet Address",
        date: "9/12/2024",
        status: "completed",
        txnId: "TXN09834",
      },
      {
        name: "Wallet Address",
        date: "9/12/2024",
        status: "completed",
        txnId: "TXN09833",
      },
      {
        name: "Wallet Address",
        date: "9/12/2024",
        status: "pending",
        txnId: "TXN09832",
      },
      {
        name: "Wallet Address",
        date: "9/12/2024",
        status: "completed",
        txnId: "TXN09831",
      },
      {
        name: "Wallet Address",
        date: "9/12/2024",
        status: "completed",
        txnId: "TXN09830",
      },
    ]);
  }, [rewardId]);

  if (!reward) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">Reward not found.</p>
        <button
          onClick={() => router.push("/token_marketplace")}
          className="text-blue-600 text-sm mt-2"
        >
          &lt; Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => router.push("/token_marketplace")}
        className="text-blue-600 text-sm font-medium"
      >
        &larr; Back to Marketplace
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section: Details */}
        <div className="md:col-span-2 border border-gray-200 rounded-lg p-5 bg-white">
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-5">
            <img
              src={reward.image}
              alt={reward.title}
              className="object-cover h-full w-full rounded-lg"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">{reward.title}</h2>
          <p className="text-gray-600 mb-4">{reward.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-2">
            <div>
              <p className="font-medium">Validity</p>
              <p>6 months from redemption</p>
            </div>
            <div>
              <p className="font-medium">Locations</p>
              <p>Available at all premium cinema chains</p>
            </div>
            <div>
              <p className="font-medium">What's Included</p>
              <ul className="list-disc list-inside">
                <li>Premium seating</li>
                <li>Complimentary popcorn</li>
                <li>Priority booking</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Terms & Conditions</p>
              <p>Valid for any movie, any time. Subject to availability.</p>
            </div>
          </div>
        </div>

        {/* Right Section: Redeem Box (Condensed) */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white flex flex-col justify-between h-48">
          <h3 className="text-base font-semibold text-center">Redeem Token</h3>
          <div className="text-blue-600 text-2xl font-bold text-center my-2">
            🔵 {reward.tokens}
          </div>
          <p className="text-[10px] text-gray-500 text-center mt-1">
            By redeeming, you agree to the terms.
          </p>
        </div>
      </div>

      {/* Redemption History */}
      <div className="border border-gray-200 rounded-lg p-5 bg-white">
        <h3 className="text-lg font-semibold mb-4">Redemption History</h3>
        <p className="text-sm text-gray-500 mb-3">
          Recent redemptions for this token
        </p>
        <div className="space-y-3">
          {redemptions.map((r, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded border border-gray-200 bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    r.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {r.status}
                </span>
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.date}</p>
                </div>
              </div>
              <div className="text-xs text-gray-600 text-right">
                <p className="text-gray-400">Transaction ID</p>
                <strong>{r.txnId}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardDetails;
