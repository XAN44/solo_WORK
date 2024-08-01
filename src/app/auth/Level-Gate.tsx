export const maxDuration = 60; // This function can run for a maximum of 5 seconds

import { UserLevel } from "@prisma/client";
import { useCurrentLevel } from "../../../hooks/use-curret-user";

interface Level {
  children: React.ReactNode;
  allowedLevel: UserLevel;
}

function LevelGate({ children, allowedLevel }: Level) {
  const user = useCurrentLevel();

  if (user !== allowedLevel) {
    return <> </>;
  }

  return <div className="">{children}</div>;
}

export default LevelGate;
