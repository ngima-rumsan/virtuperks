import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import MyTaskListMain from "./list";

interface TaskProps {
  router: AppRouterInstance;
}

function Task({ router }: TaskProps) {
  return <MyTaskListMain router={router} />;
}

export default Task;
