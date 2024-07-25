import { Inter, Roboto, Roboto_Flex, Roboto_Mono } from "next/font/google";

import clsx from "clsx";
import { currentUser } from "../../../lib/auth";
import Sidebar from "../../../components/ui/sidebar/Sidebar";

const inter = Roboto_Mono({
  weight: "variable",
  subsets: ["vietnamese"],
});

export default async function Protect_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (
    <section className={clsx(inter.className, "min-h-screen")}>
      <Sidebar user={user!}>{children}</Sidebar>
    </section>
  );
}
