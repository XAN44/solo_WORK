import { Inter, Roboto } from "next/font/google";
import { cn } from "../../lib/utils";

const inter = Inter({
  weight: "variable",
  subsets: ["vietnamese"],
});

export default function Layout_AUTH({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={inter.className}>{children}</main>;
}
