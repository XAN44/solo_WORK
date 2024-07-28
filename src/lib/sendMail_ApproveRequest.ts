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

export const sendWithApproveRequest = async (
  id: string,
  email: string,
  name: string,
  title: string,
  last: string,
  statusLeave: string,
) => {
  const now = new Date();
  const confirmLink = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/leavequest/${id}`;

  // แปลค่า createAt เป็นข้อความ

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `เรียนคุณ ${name} เกี่ยวกับการลางานของคุณในหัวข้อ ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
        <h2 style="font-size: 24px; color: #1f2937; margin-bottom: 10px;">Notification of leave status</h2>
        <p style="color: #4b5563; margin-bottom: 15px;">
          การลางานของคุณในหัวข้อ <strong>${title}</strong> <br/>
          เรียนคุณ <strong>${name}</strong> นามสกุล <strong>${last}</strong><br/>
          หัวหน้างานได้ทำการตรวจสอบการขอลางานของคุณแล้ว
        </p>
        <p style="color: #4b5563; margin-bottom: 15px;">
          สถานะการลา: <strong>${statusLeave}</strong>
        </p>
   
        <p style="color: #4b5563;">
          ขออภัย หากคุณไม่ได้มีส่วนเกี่ยวข้องกับเมลชิ้นนี้
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
