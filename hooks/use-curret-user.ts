// TODO: ใช้สำหรับ Client Page
import { useSession } from "next-auth/react";
export const UseCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};

export const useCurrentLevel = () => {
  const session = useSession();

  return session.data?.user.level;
};
