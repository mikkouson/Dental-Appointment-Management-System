"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(
      "/login?message=  Please check your password and account name and try again."
    );
  }
  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  } else {
    revalidatePath("/admin", "layout");
    redirect("/admin");
  }
}

export async function loginWithGoogle() {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
    return error;
  } else {
    return redirect(data.url);
  }
}
