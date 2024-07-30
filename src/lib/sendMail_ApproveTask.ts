import nodemailer from "nodemailer";
import { format } from "date-fns-tz";
import { th } from "date-fns/locale";
import { CreateAt } from "@prisma/client";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWithApproveTask = async (
  email: string,
  name: string,
  last: string,
  title: string,
  description: string,
  status: string,
) => {
  const now = new Date();

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `รายงานถึงคุณ ${name} นามสกุล ${last}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
        <h2 style="font-size: 24px; color: #1f2937; margin-bottom: 10px;">Notification status your task</h2>
        <p style="color: #4b5563; margin-bottom: 15px;">
          หัวข้องาน : <strong>${title}</strong> <br/>
          รายละเอียดงาน : <strong>${description}</strong> <br/>
           หัวหน้างานได้ทำการตรวจสอบงานของคุณแล้ว
        </p>
        <p style="color: #4b5563; margin-bottom: 15px;">
          สถานะงานปัจจุบัน: <strong>${status}</strong>
        </p>
   
        <p style="color: #4b5563;">
          ขออภัย หากคุณไม่ได้มีส่วนเกี่ยวข้องกับเมลชิ้นนี้
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
