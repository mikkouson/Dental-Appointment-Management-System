import { createClient } from "@/utils/supabase/server";

export async function User() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>User not found</div>;
  }
  return <div>{user.email}</div>;
}
