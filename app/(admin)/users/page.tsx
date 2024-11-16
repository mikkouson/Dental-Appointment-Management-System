import React, { Suspense } from "react";
import { Metadata } from "next";
import Loading from "./loading";
import Client from "@/components/tables/users-table/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Lobodent Dental Clinic - Services",
};

export default async function Page() {
  // Create Supabase client on the server
  const supabase = createClient();

  // Get user session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Get user profile with role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  // Check for super_admin role
  if (profile?.role !== "super_admin") {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<Loading />}>
      <Client />
    </Suspense>
  );
}
