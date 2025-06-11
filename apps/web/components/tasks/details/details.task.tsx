import { Cuid } from "@/components/departments/details/details.main";
import { useGetTaskById } from "@/hooks/subgraph/taskDetail";
import { formatDate } from "@/utils/formatDate";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { ExternalLink, Timer, Trophy, UserRoundCog, Users } from "lucide-react";

type TaskDetailsProps = {
  cuid: Cuid;
};

const TaskDetails = ({ cuid }: TaskDetailsProps) => {
  console.log("CUID: ", cuid);
  const getTaskDetail = useGetTaskById(cuid.id);
  console.log("Task Details: ", getTaskDetail.data);

  const taskData = getTaskDetail.data?.data?.taskCreated;
  console.log("data--", taskData);

  const formattedDate = formatDate(taskData?.taskDetail?.expiryDate);

  const handleUrlClick = (e: React.MouseEvent<HTMLDivElement>, url: string) => {
    e.preventDefault();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <Card className="w-[80%] h-full p-4">
        <CardTitle className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-2">
            <span>{taskData?.taskDetail?.name}</span>
            <span className="w-20 h-6 flex items-center justify-center bg-green-50 rounded-full text-green-700 p-1 text-sm font-normal">
              Status
            </span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-blue-400"
            onClick={(e) => handleUrlClick(e, taskData?.taskDetail?.detailsUrl)}
          >
            <span className="text-[#297AD6] text-sm font-normal">
              {taskData?.taskDetail?.detailsUrl}
            </span>
            <ExternalLink size={16} color="#297AD6" strokeWidth={2.75} />
          </div>
        </CardTitle>

        <div className="mt-3 mb-3 w-full overflow-hidden">
          <p className="text-[#334155] text-sm line-clamp-1"></p>
        </div>

        <div className="flex flex-col text-gray-500 font-normal gap-1 text-sm">
          <span className="flex items-center gap-2">
            <UserRoundCog color="#64748B" size={20} strokeWidth={2.5} />
            Task Owner: {taskData?.taskDetail?.owner}
          </span>
          <span className="flex items-center gap-2">
            <Users color="#64748B" size={20} strokeWidth={2.5} />
            {taskData?.taskDetail.maxParticipants} members participating
          </span>
          <span className="flex items-center gap-2">
            <Timer color="#64748B" size={20} strokeWidth={2.5} /> Deadline:{" "}
            {formattedDate}
          </span>
        </div>
      </Card>

      <Card className="w-[20%] flex flex-col items-center justify-center ml-auto p-4 gap-3">
        <div className="flex items-center justify-center rounded-full h-10 w-10 bg-blue-50">
          <Trophy color="#297AD6" size={20} />
        </div>
        <span className="text-xl text-[#297AD6] font-bold">
          {taskData?.taskDetail?.totalRewardAmount} tokens
        </span>
      </Card>
    </>
  );
};

export default TaskDetails;
