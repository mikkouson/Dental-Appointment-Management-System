"use client";

import React from "react";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/components/hooks/useSidebar";
import Link from "next/link";
import { DashboardNav } from "../dashboard-nav";
import Image from "next/image";
import Logo from "@/images/logo.png";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 lg:block`,
        !isMinimized ? "w-72" : "w-[72px]",
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link href={"/"}>
          <div className="flex items-center">
            <Image height={50} width={50} src={Logo} alt="Logo" />
            {!isMinimized && (
              <h3 className="scroll-m-20 text-lg font-semibold tracking-tight lg:block">
                Lobodent Dental Clinic
              </h3>
            )}
          </div>
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          "absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}
