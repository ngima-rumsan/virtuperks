import { DepartmentDetails } from "@workspace/sdk/type";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Car,
  Coffee,
  Gamepad2,
  ShoppingBag,
  Smartphone,
  Ticket,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { Reward } from "../../../type/token.marketplace";

interface DepartmentListCardProps {
  router: AppRouterInstance;
  entityList: DepartmentDetails[];
}

// Icon selector based on category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Entertainment":
      return <Ticket className="h-6 w-6 text-[#334155]" />;
    case "Food & Beverage":
      return <Coffee className="h-6 w-6 text-[#334155]" />;
    case "Utilities":
      return <Smartphone className="h-6 w-6 text-[#334155]" />;
    case "Shopping":
      return <ShoppingBag className="h-6 w-6 text-[#334155]" />;
    case "Transportation":
      return <Car className="h-6 w-6 text-[#334155]" />;
    default:
      return <Gamepad2 className="h-6 w-6 text-[#334155]" />;
  }
};

const TokenMarketListCard = ({}) => {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const rewards = [
    {
      id: 1,
      title: "Movie Ticket",
      description: "Premium cinema experience",
      tokens: 500,
      category: "Entertainment",
    },
    {
      id: 2,
      title: "Coffee",
      description: "Premium coffee blend",
      tokens: 150,
      category: "Food & Beverage",
    },
    {
      id: 3,
      title: "Mobile TopUp",
      description: "Mobile recharge service",
      tokens: 200,
      category: "Utilities",
    },
    {
      id: 4,
      title: "Gift Card",
      description: "Universal gift voucher",
      tokens: 1000,
      category: "Shopping",
    },
    {
      id: 5,
      title: "Taxi Ride",
      description: "City transportation service",
      tokens: 300,
      category: "Transportation",
    },
    {
      id: 6,
      title: "Restaurant Meal",
      description: "Fine dining experience",
      tokens: 800,
      category: "Food & Beverage",
    },
    {
      id: 7,
      title: "Shopping Voucher",
      description: "Retail store credit",
      tokens: 600,
      category: "Shopping",
    },
    {
      id: 8,
      title: "Gaming Credits",
      description: "In-game currency",
      tokens: 250,
      category: "Entertainment",
    },
  ];

  return (
    <div className="w-full p-4 mt-10">
      {/* Title and Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A]">Token Marketplace</h1>
        <p className="text-[#64748B] text-sm mt-2">
          Redeem your tokens for amazing services and rewards
        </p>
      </div>

      {/* Grid of Rewards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {rewards.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                {/* Category Icon on the left */}
                <div>{getCategoryIcon(item.category)}</div>

                {/* Category badge on the right */}
                <span className="bg-[#F1F5F9] text-[#334155] text-xs font-medium px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>

              <CardTitle className="text-lg text-[#0F172A] mt-2">
                {item.title}
              </CardTitle>
              <CardDescription className="text-sm text-[#64748B]">
                {item.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto">
              <div className="text-sm text-[#64748B] mb-1">
                <CardDescription>Tokens Required:</CardDescription>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-[#297AD6] text-xl font-bold">
                  ●{item.tokens}
                </div>

                {/* Trigger Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-[#297AD6] hover:bg-[#1E61B4] text-white"
                      onClick={() => setSelectedReward(item)}
                    >
                      Redeem
                    </Button>
                  </DialogTrigger>

                  {selectedReward?.id === item.id && (
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {getCategoryIcon(item.category)} Confirm Redemption
                        </DialogTitle>
                        <DialogDescription>
                          Are you sure you want to buy this service?
                        </DialogDescription>
                      </DialogHeader>

                      <div className="bg-[#F8FAFC] rounded-lg p-4 mt-4 space-y-1">
                        <p className="text-sm font-semibold text-[#0F172A]">
                          {item.title}
                        </p>
                        <p className="text-sm text-[#64748B]">
                          {item.description}
                        </p>
                        <p className="text-sm font-medium text-[#297AD6] mt-1">
                          ● {item.tokens} tokens
                        </p>
                      </div>

                      <DialogFooter className="mt-6 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedReward(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-[#297AD6] hover:bg-[#1E61B4] text-white"
                          onClick={() => {
                            // Call redemption logic here
                            console.log("Redeemed:", item.title);
                            setSelectedReward(null);
                          }}
                        >
                          Confirm Purchase
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TokenMarketListCard;
