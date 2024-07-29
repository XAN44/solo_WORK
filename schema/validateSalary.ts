import { typeOfWork } from "@prisma/client";
import { z } from "zod";

export const AccumulationSettingsSchema = z.object({
  typeOfWork: z.nativeEnum(typeOfWork),
  amount: z.number().nonnegative(), // ตรวจสอบว่า amount เป็นตัวเลขที่ไม่เป็นลบ
});
