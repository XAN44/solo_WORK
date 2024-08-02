import { signOut } from "next-auth/react";

import { Inter, Roboto_Mono } from "next/font/google";
import { currentUser } from "../../../lib/auth";
import { getUserByIdBackUp } from "../../../../data/user";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../../types/modalSumary";
import { auth } from "../../../../auth";
import dynamic from "next/dynamic";
import Btn_signOut from "../../../components/auth/btnClinent_SignOut";
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
    <Sidebar user={user!}>
      <div className={inter.className}>{children}</div>
    </Sidebar>
  );
}
