"use client";

import TokenMarketPlace from "@/components/token_marketplace/main";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <TokenMarketPlace router={router} />;
}

export default dynamic(() => Promise.resolve(Page));
