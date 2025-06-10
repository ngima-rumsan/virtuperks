"use client";

import { useGetAllTask } from "@/hooks/subgraph/task";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Plus } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import ListCardDetails from "./list.card";
import { DatePickerWithRange } from "./list.date";

interface TaskListMainProps {
  router: AppRouterInstance;
}

export default function TaskListMain({ router }: TaskListMainProps) {
  const [tabStatus, setTabStatus] = useState("open");

  const getAllTask = useGetAllTask();

  const taskList = getAllTask?.data?.data?.taskCreateds;

  console.log("Status: ", taskList);

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex flex-col w-[80%] gap-1">
            <h1 className="font-bold text-xl">Task List</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              List of all the tasks
            </h3>
          </div>

          <div className="flex flex-col ml-auto justify-end h-full">
            <Button
              className="min-w-[10rem] fw-[600] h-10"
              variant="default"
              type="submit"
              onClick={() => router.push(PATHS.TASKS.ADD)}
            >
              <Plus size={22} strokeWidth={2.75} />
              <span>Create Task</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="open" className="">
          <div className="flex items-center">
            <div className="w-[400px]">
              <TabsList className="flex bg-blue-50 h-10">
                <TabsTrigger
                  value="open"
                  className="w-full h-8"
                  onClick={() => setTabStatus("open")}
                >
                  Open
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  className="w-full h-8"
                  onClick={() => setTabStatus("closed")}
                >
                  Closed
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="ml-auto">
              <DatePickerWithRange />
            </div>
          </div>

          <div className="w-full mt-5 mb-5">
            <TabsContent className="w-full" value="open">
              <ListCardDetails
                taskList={taskList}
                router={router}
                tabStatus={tabStatus}
              />
            </TabsContent>
            <TabsContent className="w-full" value="closed">
              <ListCardDetails
                taskList={taskList}
                router={router}
                tabStatus={tabStatus}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
