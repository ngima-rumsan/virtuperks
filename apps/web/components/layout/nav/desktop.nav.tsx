"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ConnectKitButton } from "connectkit";
import { Briefcase, Layers, LayoutList, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "../../../type/nav.types";
import { navItemPaths } from "./navItemPaths";

export default function DesktopNav() {
  const pathname = usePathname();

  const getNavItemClasses = (navItem: NavItem) => {
    const paths = navItemPaths[navItem];

    return paths.some((path) => {
      if (path === "/task_portal") {
        return (
          pathname === "/task_portal" ||
          (pathname.startsWith("/task_portal/") &&
            pathname !== "/task_portal/mine")
        );
      }
      if (path === "/task_portal/mine") {
        return pathname === "/task_portal/mine";
      }
      return pathname === path || pathname.startsWith(`${path}/`);
    })
      ? "text-[#297AD6] border-b-2 border-[#297AD6]"
      : "text-[#1E293B] hover:text-[#1e293b]";
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-14 items-center px-4 gap-8">
        <nav className="flex items-center justify-center w-[50px] h-full">
          <Link
            href="/departments"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.DEPARTMENTS)}`}
          >
            <Layers size={18} strokeWidth={2.65} />
            Department
          </Link>
          <Link
            href="/tasks"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.TASKS)}`}
          >
            <Briefcase size={18} strokeWidth={2.65} />
            Task Management
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4 h-full">
          <Link
            href="/task_portal"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.TASK_PORTAL)}`}
          >
            <LayoutList size={18} strokeWidth={2.65} />
            Tasks Portal
          </Link>

          <div className="flex items-center h-10 bg-[#F1F5F9] rounded-md p-2">
            <span className="flex items-center gap-2 font-normal text-[#1E293B] text-sm middle-ellipsis">
              <Wallet size={18} strokeWidth={2.65} color="#334155" />
              <ConnectKitButton showAvatar={false} theme="auto" />
            </span>
          </div>

          <Avatar className="bg-red-400 h-7 w-7">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
