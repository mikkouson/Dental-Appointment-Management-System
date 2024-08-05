import Logo from "@/images/logo.png";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle";
export default function Navigation() {
  return (
    <nav className="min-h-16 border-b border-gray-muted-foreground flex items-center  ">
      <section className="w-full xl:mx-40 flex justify-between">
        <div className="flex  items-center">
          <Image height={50} width={50} src={Logo} />
          <h1 className="text-lg font-bold">Lobodent Dental Clinic</h1>
        </div>
        <div>
          <ModeToggle />
        </div>
      </section>
    </nav>
  );
}
