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
import { BriefcaseMedical, Calendar, ChevronLeft, Package } from "lucide-react";
import Logo from "@/images/logo.png";
import { usePathname } from "next/navigation";

export const links = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: (
      <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Patients",
    href: "/admin/patients",
    icon: (
      <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },

  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: (
      <Package className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: (
      <BriefcaseMedical className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: (
      <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];
interface Props {
  children?: ReactNode;
  // any props that come into the component
}
export function SidebarDemo({ children, ...props }: Props) {
  const [open, setOpen] = useState(true);
  const path = usePathname();
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
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden items-center">
            {open ? (
              <Logos /> // Replace with your open state content
            ) : (
              <LogoIcon /> // Replace with your closed state content
            )}
            <div className="mt-8 flex flex-col gap-1">
              {links.map((link, idx) => (
                <div
                  className={cn(
                    "px-2 rounded-lg ",
                    path === link.href
                      ? "bg-[#1c1c21] border border-neutral-700 "
                      : "transparent",
                    "opacity-80"
                  )}
                >
                  <SidebarLink key={idx} link={link} />
                </div>
              ))}
            </div>
          </div>
          <div>
            {/* Example of Avatar link */}
            {/* <SidebarLink
              link={{
                label: "Lobodent",
                href: "#",
                icon: (
                  <Image
                    src={Logo}
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

export const Logos = () => {
  return (
    <Link
      href="/admin"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src={Logo}
        className="h-7 w-7 flex-shrink-0 rounded-full"
        width={50}
        height={50}
        alt="Avatar"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Lobodent Dental
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/admin"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src={Logo}
        className="h-7 w-7 flex-shrink-0 rounded-full"
        width={50}
        height={50}
        alt="Avatar"
      />
    </Link>
  );
};
