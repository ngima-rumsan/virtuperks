import { useGraphService } from "@/providers/subgraph-provider";
import { useQuery } from "@tanstack/react-query";

export const useGetTaskById = (id: string) => {
  const { queryService } = useGraphService();
  console.log("ID in Hook: ", id);
  return useQuery({
    queryKey: ["taskById", id],
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Subgraph query service is not initialized.");
      }
      const taskDetail = await queryService?.getTaskById(id);
      return taskDetail;
    },
    enabled: !!id && !!queryService,
  });
};
