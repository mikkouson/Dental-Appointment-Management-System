import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { SidebarDemo } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
export const metadata: Metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SidebarDemo>
        <main className=" overflow-auto  p-2  rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
          <Header />
          <NextTopLoader color="#facc15" showSpinner={false} />
          {children}
        </main>
      </SidebarDemo>
    </div>
  );
}
