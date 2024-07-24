import Sidebar_Body from "./components/Sidebar_Body";
import { ExtendendUser } from "../../../app/types/next-auth";

interface Props {
  children: React.ReactNode;
  user?: ExtendendUser;
}

export default function Sidebar({ children, user }: Props) {
  return (
    <div className="p-3">
      <div className="fixed z-50 h-full w-28">
        <Sidebar_Body user={user} />
      </div>
      <main className="h-full w-full p-16">{children}</main>
    </div>
  );
}
