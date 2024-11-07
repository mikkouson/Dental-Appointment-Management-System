import { SidebarDemo } from "@/components/sidebar";
import { createClient } from "@/utils/supabase/server";
import NextTopLoader from "nextjs-toploader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log(user);
  return (
    <div className="flex">
      <SidebarDemo user={user}>
        <main className=" overflow-auto rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
          {/* <Header /> */}
          <NextTopLoader color="#facc15" showSpinner={false} />
          {children}
        </main>
      </SidebarDemo>
    </div>
  );
}
