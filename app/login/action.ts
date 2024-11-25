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

  // First, attempt to sign in
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword(data);

  if (signInError) {
    redirect(
      "/login?message=Please check your password and account name and try again."
    );
  }

  // Check user metadata
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    // Handle the error case
    await supabase.auth.signOut(); // Sign out if we can't verify the user role
    redirect("/login?message=Unable to verify user permissions.");
  }

  // Check if user has patient role/metadata
  const isPatient = user.user_metadata?.role === "patient";

  if (isPatient) {
    // If user is a patient, sign them out and redirect with message
    await supabase.auth.signOut();
    redirect(
      "/login?message=Access denied. Patient accounts cannot access this area."
    );
  }

  // If we get here, the user is not a patient and can proceed
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  } else {
    revalidatePath("/", "layout");
    redirect("/login");
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
