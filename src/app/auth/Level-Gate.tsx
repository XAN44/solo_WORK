import { UserLevel } from "@prisma/client";
import { useCurrentLevel } from "../../lib/auth";

interface Level {
  children: React.ReactNode;
  allowedLevel: UserLevel;
}

async function LevelGate({ children, allowedLevel }: Level) {
  const user = await useCurrentLevel();

  if (user !== allowedLevel) {
    return <>CANNOT ALLOWED TO SEE</>;
  }

  return <div>{children}</div>;
}

export default LevelGate;
