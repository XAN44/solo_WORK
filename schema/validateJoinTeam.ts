import { typeOfWork } from "@prisma/client";
import { z } from "zod";

export const JoinTeam = z.object({
  id: z.string(),
});
