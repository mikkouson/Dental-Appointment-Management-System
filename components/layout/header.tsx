import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "react-day-picker";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { UserNav } from "./user-nav";
import { MobileBody, MobileSidebar, Sidebar, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react"; // Assuming ChevronLeft is part of Tabler Icons
const links = [
  {
    label: "Dashboard",
    href: "#",
    icon: (
      <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Profile",
    href: "#",
    icon: (
      <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Settings",
    href: "#",
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
export default function Header() {
  return (
    <header>
      <nav className="flex items-center justify-between px-4 py-2 lg:justify-end">
        <div className={cn("block lg:!hidden")}>
          <div>
            {/* Sidebar component */}
            <Sidebar>
              <MobileBody className="justify-between gap-10 xl:relative">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                  {/* {open ? (
              <Logo /> // Replace with your open state content
            ) : (
              <LogoIcon /> // Replace with your closed state content
            )} */}

                  <div className="mt-8 flex flex-col gap-2">
                    {links.map((link, idx) => (
                      <SidebarLink key={idx} link={link} />
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

        <div className="flex items-center gap-2 relative">
          <ThemeToggle />
          <UserNav />
        </div>
      </nav>
    </header>
  );
}
