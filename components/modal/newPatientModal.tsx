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
import Maps from "../gmaps";
import { useEffect, useState } from "react";

interface DrawerDialogDemoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  children: React.ReactNode;
}

export function DrawerDialogDemo({
  open,
  setOpen,
  label,
  children,
}: DrawerDialogDemoProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  useEffect(() => {
    // Disable Radix ui dialog pointer events lockout
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary">
            <Plus size={20} className="mr-2" />
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[1000px]"
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
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
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
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
