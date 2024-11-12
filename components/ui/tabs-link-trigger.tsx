import Link from "next/link";
import { TabsTrigger } from "./tabs";
import { useQueryState } from "nuqs";

export const TabsLinkTrigger: React.FC<{
  href: string;
  value: string;
  children: React.ReactNode;
  paramName?: string; // Optional parameter name for the query string
}> = ({ href, children, value, paramName = "tabs" }) => {
  const [activeTab, setActiveTab] = useQueryState(paramName);

  const handleClick = async () => {
    await setActiveTab(value);
  };

  return (
    <TabsTrigger
      value={value}
      asChild
      className="flex items-center gap-2 cursor-pointer"
    >
      <div onClick={handleClick}>{children}</div>
    </TabsTrigger>
  );
};
