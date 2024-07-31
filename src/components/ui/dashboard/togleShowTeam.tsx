import { Button } from "../button";
import FormWork from "../profile/FormWork";
import FormJoinTeam from "./formJoinTeam";
import { team } from "prisma/prisma-client";

type User = {
  id: string;
  username: string | null;
  email: string | null;
  emailVerified: Date | null;
  password: string | null;
  image: string | null;
  first_name: string | null;
  last_name: string | null;
};

type TeamMember = {
  user: User | null;
};

interface Team {
  id: string;
  department: string;
  project: string;
  member: TeamMember[];
}

interface FormJoinTeamProps {
  team: Team; // เปลี่ยนชื่อจาก Team เป็น team เพื่อหลีกเลี่ยงการสับสน
}

interface ShowTogle {
  isOpen: boolean;
  onClose: () => void;
  team: Team[];
}

export default function ShowTeamForJoin({ onClose, isOpen, team }: ShowTogle) {
  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-full w-full overflow-y-auto rounded-xl bg-white md:h-[760px] md:w-[600px]">
        <Button
          variant="ghost"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          X
        </Button>
        <div className="h-full w-full">
          <FormJoinTeam team={team!} />
        </div>
      </div>
    </div>
  );
}
