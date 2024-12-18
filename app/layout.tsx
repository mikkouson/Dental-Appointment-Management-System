import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SWRProvider } from "./swr-provider";
import { Toaster } from "@/components/ui/toaster";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SidebarDemo } from "@/components/sidebar";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lobodent Dental Clinic",
  description:
    "Lobodent Dental Clinic is now an Orthero certified provider offering comfortable and invisible Orthero Clear Aligners. Visit us at 2nd Floor, R Building, President Jose P. Laurel Highway, Brgy 1, Marawoy, Lipa City. We are open Monday - Saturday, 10am - 5pm, and Sunday, 10am - 3pm. Parking spaces available.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <Navigation /> */}
            <main className="h-screen flex flex-col  ">
              {/* <SidebarDemo user={user}> */}
              <SWRProvider>
                <NuqsAdapter>{children}</NuqsAdapter>
              </SWRProvider>
              {/* </SidebarDemo> */}
            </main>

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
