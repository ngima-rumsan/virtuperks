import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TokenMarketListCard from "./list";

interface TokenMarketPlace {
  router: AppRouterInstance;
}

function TokenMarketPlace({ router }: TokenMarketPlace) {
  return (
    <main className="w-full">
      <TokenMarketListCard router={router} />
    </main>
  );
}

export default TokenMarketPlace;
