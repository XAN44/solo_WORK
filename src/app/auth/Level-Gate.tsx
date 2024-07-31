export const maxDuration = 5; // This function can run for a maximum of 5 seconds

import { UserLevel } from "@prisma/client";
import { useCurrentLevel } from "../../lib/auth";

interface Level {
  children: React.ReactNode;
  allowedLevel: UserLevel;
}

async function LevelGate({ children, allowedLevel }: Level) {
  const user = await useCurrentLevel();

  if (user !== allowedLevel) {
    return <> </>;
  }

  return <div className="">{children}</div>;
}

export default LevelGate;
