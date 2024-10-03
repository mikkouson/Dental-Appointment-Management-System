"use client";
import React, { ReactNode, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react"; // Assuming ChevronLeft is part of Tabler Icons
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { navItems } from "@/constants/data";
import { DashboardNav } from "./dashboard-nav";
interface Props {
  children?: ReactNode;
  // any props that come into the component
}
export function SidebarDemo({ children, ...props }: Props) {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      {/* Sidebar component */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 md:relative">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* {open ? (
              <Logo /> // Replace with your open state content
            ) : (
              <LogoIcon /> // Replace with your closed state content
            )} */}
            <DashboardNav items={navItems} />
          </div>
          <div>
            {/* Example of Avatar link */}
            {/* <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            /> */}
          </div>
          <ChevronLeft
            className={cn(
              " -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground absolute ",
              open && "rotate-180"
            )}
            onClick={handleToggle} // Toggle sidebar open/close on click
          />
        </SidebarBody>
      </Sidebar>
      {/* Placeholder for Dashboard component */}
      {/* <Dashboard /> */}
      {children}
    </div>
  );
}
