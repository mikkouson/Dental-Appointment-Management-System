import { signOut } from "@/app/login/action";
import SubmitButton from "./submitBtn";
import { User } from "../user";
import { createClient } from "@/utils/supabase/server";

export async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex">
      <User />

      <form>
        <SubmitButton
          pendingText="Signing out..."
          className="w-full"
          formAction={signOut}
        >
          Sign Out
        </SubmitButton>
      </form>
    </div>
  ) : (
    <></>
  );
}
