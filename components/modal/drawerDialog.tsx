"use client";
import { useMediaQuery } from "@/components/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useTeethArray } from "@/app/store";

interface DrawerDialogDemoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  children: React.ReactNode;
  title?: boolean;
}

export function DrawerDialogDemo({
  open,
  setOpen,
  label,
  children,
  title = true,
}: DrawerDialogDemoProps) {
  const { clearTeethLocations } = useTeethArray();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary " onClick={() => clearTeethLocations()}>
            <Plus size={20} className="mr-2 " />
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent
          className={"lg:max-w-screen-lg overflow-y-auto max-h-screen"}
          onInteractOutside={(e) => {
            const hasPacContainer = e.composedPath().some((el: EventTarget) => {
              if ("classList" in el) {
                return Array.from((el as Element).classList).includes(
                  "pac-container"
                );
              }
              return false;
            });

            if (hasPacContainer) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            {title && <DialogTitle>{label}</DialogTitle>}
            {/* <DialogDescription>
              Make changes to your profile here. Click save when youre done.
            </DialogDescription> */}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="bg-primary text-xs p-0  sm:text-sm px-2 sm:px-4"
          onClick={() => clearTeethLocations()}
        >
          <Plus size={14} />
        </Button>
      </DrawerTrigger>

      <DrawerContent
        onInteractOutside={(e) => {
          const hasPacContainer = e.composedPath().some((el: EventTarget) => {
            if ("classList" in el) {
              return Array.from((el as Element).classList).includes(
                "pac-container"
              );
            }
            return false;
          });

          if (hasPacContainer) {
            e.preventDefault();
          }
        }}
      >
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when youre done.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[50vh] w-full ">{children}</ScrollArea>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
