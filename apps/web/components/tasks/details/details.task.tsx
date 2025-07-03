import { Cuid } from "@/components/departments/details/details.main";
import { useGetTaskDetailById } from "@/hooks/subgraph/taskDetail";
import { formatDate } from "@/utils/formatDate";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { ExternalLink, Timer, Trophy, UserRoundCog, Users } from "lucide-react";

type TaskDetailsProps = {
  cuid: Cuid;
};

const TaskDetails = ({ cuid }: TaskDetailsProps) => {
  const getTaskDetail = useGetTaskDetailById(cuid.id);

  const taskData = getTaskDetail?.data?.data?.taskCreated;

  const formattedDate = formatDate(taskData?.taskDetail?.expiryDate);

  const handleUrlClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Card className="w-[80%] h-full p-4">
        <CardTitle className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#334155]">
              {taskData?.taskDetail?.name}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-white text-xs font-semibold ${
                taskData?.taskDetail?.isOpen ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {taskData?.taskDetail?.isOpen ? "Open" : "Closed"}
            </span>
          </div>

          <div className="flex items-center gap-1 max-w-[220px] truncate text-sm">
            <span
              className="text-[#297AD6] truncate"
              title={taskData?.taskDetail?.detailsUrl}
            >
              {taskData?.taskDetail?.detailsUrl
                ? taskData.taskDetail.detailsUrl.length > 40
                  ? `${taskData.taskDetail.detailsUrl.slice(0, 40)}...`
                  : taskData.taskDetail.detailsUrl
                : ""}
            </span>
            <ExternalLink
              size={16}
              color="#297AD6"
              strokeWidth={1.75}
              className="flex-shrink-0 cursor-pointer"
              onClick={(e) =>
                handleUrlClick(e, taskData?.taskDetail?.detailsUrl ?? "")
              }
            />
          </div>
        </CardTitle>

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
        <span className="text-2xl text-[#297AD6] font-bold">
          {taskData?.taskDetail?.rewardAmount} Tokens
        </span>
      </Card>
    </>
  );
};

export default TaskDetails;
