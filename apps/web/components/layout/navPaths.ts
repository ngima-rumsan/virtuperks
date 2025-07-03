import { PATHS } from "@/routes/paths";
import { NavItem } from "@/type/nav.types";

export const navItemPaths: Record<NavItem, string[]> = {
  [NavItem.PARTICIPANTS]: [PATHS.PARTICIPANT.HOME],
  [NavItem.DEPARTMENTS]: [
    PATHS.DEPARTMENT.HOME,
    "/treasurer/department/allocate",
  ],
  [NavItem.TREASURER_TOKEN]: [PATHS.TREASURER.HOME],
  [NavItem.TASK_PORTAL]: [PATHS.TASKPORTAL.HOME],
  [NavItem.MY_TASKS]: [PATHS.TASKPORTAL.DETAILS("mine")],
  [NavItem.TASKS]: [PATHS.TASKS.HOME],
  [NavItem.TOKEN]: [],
  [NavItem.TREASURER_DEPARTMENT]: [],
  [NavItem.TOKEN_MARKETPLACE]: ["/token_marketplace"],
};
