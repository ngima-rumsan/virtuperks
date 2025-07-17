import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TaskListMain from "./list";

interface TaskProps {
  router: AppRouterInstance;
}

function Task({ router }: TaskProps) {
  return <TaskListMain router={router} />;
}

export default Task;
