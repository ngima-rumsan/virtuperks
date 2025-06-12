import { useGraphService } from "@/providers/subgraph-provider";
import { useQuery } from "@tanstack/react-query";

export const useGetTaskDetailById = (id: string) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["taskDetail", id],
    queryFn: async () => {
      const taskDetail = await queryService?.getTaskById(id);
      return taskDetail;
    },
  });
};
