"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ConnectKitButton } from "connectkit";
import {
  Coins,
  Layers,
  LayoutDashboard,
  LayoutList,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { NavItem } from "../../../type/nav.types";
import { navItemPaths } from "./navItemPaths";

export default function UnifiedNav({ children }: PropsWithChildren) {
  const pathname = usePathname();
  console.log("Active Page: ", pathname);

  const getNavItemClasses = (navItem: NavItem) => {
    // const paths = navItemPaths[navItem];
    const paths = navItemPaths[navItem] ?? [];

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
    console.log(`Checking ${navItem}:`, paths, "Against pathname:", pathname);
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-14 items-center px-4 gap-8 border-b-2 border-[#E2E8F0]">
        {/* Logo */}
        <nav className="flex items-center justify-center w-[50px] h-full">
          <Link href={NavItem.TASK_PORTAL}>
            <Image
              src="/bg/rumsan-logo.png"
              width={50}
              height={50}
              alt="Logo"
            />
          </Link>
        </nav>

        {/* Navigation */}
        <nav className="flex items-center gap-6 h-full">
          <Link
            href="/participants"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.PARTICIPANTS)}`}
          >
            <LayoutDashboard size={18} strokeWidth={2.65} />
            Participants
          </Link>

          <Link
            href="/departments"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.DEPARTMENTS)}`}
          >
            <Coins size={18} strokeWidth={2.65} />
            Department
          </Link>

          <Link
            href="/tasks"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.TASKS)}`}
          >
            <Layers size={18} strokeWidth={2.65} />
            Task Management
          </Link>

          {/* <Link
            href="/treasurer/token"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.TREASURER_TOKEN)}`}
          >
            <Layers size={18} strokeWidth={2.65} />
            Token Management
          </Link> */}

          <Link
            href="/token_marketplace"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.TOKEN_MARKETPLACE)}`}
          >
            <ShoppingBag size={18} strokeWidth={2.65} />
            Token Marketplace
          </Link>
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-4 h-full">
          <Link
            href="/task_portal"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.TASK_PORTAL)}`}
          >
            <LayoutList size={18} strokeWidth={2.65} />
            Tasks Portal
          </Link>

          <Link
            href="/task_portal/mine"
            className={`flex items-center gap-2 text-sm font-normal transition-colors h-full p-2 ${getNavItemClasses(NavItem.MY_TASKS)}`}
          >
            <LayoutList size={18} strokeWidth={2.65} />
            My Tasks
          </Link>

          <div className="flex items-center h-10 p-2 bg-[#F1F5F9] rounded-md">
            <span className="flex items-center gap-2 font-normal text-[#1E293B] text-sm">
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

      {/* Page Content */}
      <div className="h-[calc(100dvh-60px)] overflow-auto">{children}</div>
    </header>
  );
}
