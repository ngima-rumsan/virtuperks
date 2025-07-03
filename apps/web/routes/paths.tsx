const ROOTS = {
  DASHBOARD: "/",
  DEPARTMENT: "/departments",
  TREASURY: "/treasury",
  PARTICIPANT: "/participants",
  TREASURER: "/treasurer",
  TASKS: "/tasks",
  TASKPORTAL: "/task_portal",
  TOKENMARKETPLACE: "/token_marketplace",
};

export const PATHS = {
  DASHBOARD: `${ROOTS.DASHBOARD}`,

  DEPARTMENT: {
    HOME: `${ROOTS.DEPARTMENT}`,
    ADD: `${ROOTS.DEPARTMENT}/add`,
    EDIT: (cuid: string) => `${ROOTS.DEPARTMENT}/${cuid}`,
    DETAILS: (cuid: string) => `${ROOTS.DEPARTMENT}/${cuid}`,
  },

  TREASURY: {
    HOME: `${ROOTS.TREASURY}`,
    ADD: `${ROOTS.TREASURY}/add`,
    EDIT: (cuid: string) => `${ROOTS.TREASURY}/${cuid}`,
    DETAILS: (cuid: string) => `${ROOTS.TREASURY}/${cuid}`,
  },

  PARTICIPANT: {
    HOME: `${ROOTS.PARTICIPANT}`,
    ADD: `${ROOTS.PARTICIPANT}/add`,
    DETAILS: (cuid: string) => `${ROOTS.PARTICIPANT}/${cuid}`,
  },

  TREASURER: {
    HOME: `${ROOTS.TREASURER}/token`,
    CREATE: (cuid: string) =>
      `${ROOTS.TREASURER}/department/allocate/${cuid}/create`,
  },

  TASKS: {
    HOME: `${ROOTS.TASKS}`,
    ADD: `${ROOTS.TASKS}/add`,
    DETAILS: (cuid: string) => `${ROOTS.TASKS}/${cuid}`,
  },

  TASKPORTAL: {
    HOME: `${ROOTS.TASKPORTAL}`,
    ADD: `${ROOTS.TASKPORTAL}/add`,
    DETAILS: (cuid: string) => `${ROOTS.TASKPORTAL}/${cuid}`,
  },

  TOKENMARKETPLACE: {
    HOME: `${ROOTS.TOKENMARKETPLACE}`,
  },
};
