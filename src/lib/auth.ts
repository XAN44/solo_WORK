// TODO : ใช้สำหรับ Server Page
import { auth } from "../../auth";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const useCurrentLevel = async () => {
  const session = await auth();

  return session?.user.level;
};
