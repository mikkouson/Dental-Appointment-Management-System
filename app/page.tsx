import { User } from "@/components/user";
import { signOut } from "./login/action";
export default function Home() {
  return (
    <div>
      <User />
      <form action={signOut}>
        <button>Signout</button>
      </form>
    </div>
  );
}
