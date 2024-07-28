import Sidebar_Body from "./components/Sidebar_Body";
import { ExtendendUser } from "../../../app/types/next-auth";

interface Props {
  children: React.ReactNode;
  user?: ExtendendUser;
}

export default function Sidebar({ children, user }: Props) {
  return (
    <section>
      <div className="fixed left-4 top-2 z-50 w-1">
        <Sidebar_Body user={user} />
      </div>
      <section className="h-full w-screen p-10 md:w-full md:p-32">
        {children}
      </section>
    </section>
  );
}
