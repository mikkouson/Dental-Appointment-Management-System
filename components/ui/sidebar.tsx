"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      {/* <MobileSidebar {...(props as React.ComponentProps<"div">)} /> */}
    </>
  );
};
export const MobileBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      {/* <DesktopSidebar {...props} /> */}
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden  lg:flex lg:flex-col bg-neutral-100 dark:bg-neutral-800 w-[240px] flex-shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "240px" : "70px") : "240px",
        }}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const [showBackdrop, setShowBackdrop] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
    setShowBackdrop(!showBackdrop);
  };

  const closeSidebar = () => {
    setOpen(false);
    setShowBackdrop(false);
  };

  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row lg:hidden items-center justify-between w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2 onClick={toggleSidebar} />
        </div>
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className={cn(
                  "fixed h-full w-3/4 md:w-1/2 inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                  className
                )}
              >
                <div
                  className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  onClick={toggleSidebar}
                >
                  <IconX />
                </div>
                {children}
              </motion.div>
              {showBackdrop && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="fixed inset-0 bg-black opacity-50 z-50"
                  onClick={closeSidebar}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
export const SidebarLink = ({
  link,
  className,
  setOpen,
  ...props
}: {
  link: Links;
  className?: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  props?: LinkProps;
}) => {
  const { open } = useSidebar();

  const closeSidebar = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      onClick={closeSidebar} // Close sidebar when link is clicked
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: open ? "inline-block" : "none",
          opacity: open ? 1 : 0,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
