import { Inter, Roboto_Mono } from "next/font/google";
import { currentUser } from "../../../lib/auth";
import { getUserByIdBackUp } from "../../../../data/user";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../../types/modalSumary";
import { auth } from "../../../../auth";
import dynamic from "next/dynamic";

const Sidebar = dynamic(
  () => import("../../../components/ui/sidebar/Sidebar"),
  {
    ssr: false, // Optionally disable server-side rendering for this component
  },
);

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
  const user = await auth();
  if (!user?.user.id) {
    return null;
  }
  const { error, success } = await getUserByIdBackUp(user.user.id || "");
  if (error || !success) {
    // ถ้าหากเกิดข้อผิดพลาด หรือไม่มีข้อมูลผู้ใช้
    return (
      <div className="skeleton fixed left-2 top-2 h-11 w-11 rounded-full"></div>
    );
  }

  return (
    <Sidebar user={success}>
      <div className={inter.className}>{children}</div>
    </Sidebar>
  );
}
