"use client";
import React, { ReactNode, Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import {
  BriefcaseMedical,
  Calendar,
  ChevronLeft,
  Package,
  UserCog,
} from "lucide-react";
import { LiaUserNurseSolid } from "react-icons/lia";
import { cn } from "@/lib/utils";
import { NavUser } from "./nav-user";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import Logo from "@/images/logo.png";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export const getLinks = (userData?: any) => {
  // Check if userData exists and has the correct nested structure
  const userRole = userData?.user_metadata?.role;

  return [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Appointments",
      href: "/appointments",
      icon: (
        <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Patients",
      href: "/patients",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Inventory",
      href: "/inventory",
      icon: (
        <Package className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Services",
      href: "/services",
      icon: (
        <BriefcaseMedical className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Doctors",
      href: "/doctors",
      icon: (
        <LiaUserNurseSolid className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },

    // Only show Users link if role is super_admin
    ...(userRole === "super_admin"
      ? [
          {
            label: "Users",
            href: "/users",
            icon: (
              <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
          },
        ]
      : []),
  ];
};

interface Props {
  children?: ReactNode;
  user: any;
}

export function SidebarDemo({ user, children, ...props }: Props) {
  const [open, setOpen] = useState(true);
  const path = usePathname();

  if (path === "/login") {
    return <>{children}</>;
  }

  const links = getLinks(user);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 md:relative">
          <div className="flex flex-col flex-1 overflow-y-hidden overflow-x-hidden">
            {open ? <Logos /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-1">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "px-2 rounded-lg",
                    path === link.href ||
                      (link.href !== "/" && path?.startsWith(link.href))
                      ? "dark:bg-[#1c1c21] border dark:border-neutral-700 bg-white border-input"
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
            <NavUser user={user} />
          </div>

          <ChevronLeft
            className={cn(
              "-right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground absolute",
              open && "rotate-180"
            )}
            onClick={handleToggle}
          />
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}

export const Logos = () => (
  <Link
    href="/"
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

export const LogoIcon = () => (
  <Link
    href="/"
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
