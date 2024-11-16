"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { getLinks, LogoIcon, Logos } from "../sidebar";
import { MobileBody, Sidebar, SidebarLink } from "../ui/sidebar";

export const BurgerMenu = () => {
  const [open, setOpen] = useState(false);
  const links = getLinks();
  return (
    <div className={cn("block lg:!hidden")}>
      <div>
        {/* Sidebar component */}
        <Sidebar open={open} setOpen={setOpen}>
          <MobileBody className="justify-between gap-10 xl:relative">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? (
                <Logos /> // Replace with your open state content
              ) : (
                <LogoIcon /> // Replace with your closed state content
              )}

              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink setOpen={setOpen} key={idx} link={link} />
                ))}
              </div>
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
          </MobileBody>
        </Sidebar>
        {/* Placeholder for Dashboard component */}
        {/* <Dashboard /> */}
      </div>
    </div>
  );
};

export default BurgerMenu;
