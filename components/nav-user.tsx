"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/login/action";
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";

const getColorFromInitial = (initial: string) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
  ];
  const index = initial.toLowerCase().charCodeAt(0) % colors.length;
  return colors[index];
};

export function NavUser({
  user,
}: {
  user: {
    email: string;
    user_metadata: {
      name: string;
      avatar_url: string;
    };
  };
}) {
  const initial = user?.user_metadata?.name?.slice(0, 1) || "CN"; // Default to 'CN'
  const fallbackColor = getColorFromInitial(initial);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center p-2 rounded-md cursor-pointer">
          <Avatar className="h-8 w-8 rounded-lg mr-2">
            <AvatarImage
              src={user?.user_metadata?.avatar_url}
              alt={user?.user_metadata?.name}
            />
            <AvatarFallback className={`rounded-lg ${fallbackColor}`}>
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.email}</span>
            <span className="truncate text-xs">
              {user?.user_metadata?.name}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user?.user_metadata?.avatar_url}
                alt={user?.user_metadata?.name}
              />
              <AvatarFallback className={`rounded-lg ${fallbackColor}`}>
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.email}</span>
              <span className="truncate text-xs">
                {user?.user_metadata?.name}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between">
          Theme
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex justify-between"
        >
          <span>Log out</span>
          <LogOut size={15} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
