import { Inter, Roboto, Roboto_Flex, Roboto_Mono } from "next/font/google";

import { currentUser } from "../../../lib/auth";
import Sidebar from "../../../components/ui/sidebar/Sidebar";
const inter = Roboto_Mono({
  weight: "variable",
  subsets: ["vietnamese"],
});
export const maxDuration = 20;

export default async function Protect_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (
    <Sidebar user={user!}>
      <div className={inter.className}>{children}</div>
    </Sidebar>
  );
}
