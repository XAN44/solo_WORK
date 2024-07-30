import nodemailer from "nodemailer";
import { format } from "date-fns-tz";
import { enUS, th } from "date-fns/locale";
import { CreateAt } from "@prisma/client";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMailWithTimeIn = async (
  email: string,
  username: string,
  name: string,
  last: string,
  department: string,
  project: string,
  startAt: Date | null,
) => {
  const now = new Date();

  const formatDate = format(now, "dd MMMM yyyy 'at' hh:mm a", { locale: th });
  const formatStartAt = format(startAt || now, "dd MMMM yyyy 'at' hh:mm a", {
    locale: enUS,
  });

  // แปลค่า createAt เป็นข้อความ

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `รายงานการลงชื่อเข้างานจากบัญชีผู้ใช้ ${username}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
        <h2 style="font-size: 24px; color: #1f2937; margin-bottom: 10px;">Notification of Time-Out</h2>
        <p style="color: #4b5563; margin-bottom: 15px;">
          เรียนคุณ <strong>${name} ${last}</strong><br/><br/>
          แผนก <strong>${department}</strong><br/><br/>
          สมาชิกจากทีมที่รับผิดชอบเกี่ยวกับโปรเจค <strong>${project}</strong>ได้ดำเนินการลงชื่อเข้าทำงาน<br/><br/>
        </p>

        <p style="color: #4b5563; margin-bottom: 15px;">
          รายละเอียดดังนี้:<br/><br/>
          <strong>เข้าทำงานเมื่อ: ${formatStartAt}</strong><br/>
 
         </p>

        <p style="color: #4b5563;">
          ขออภัย หากคุณไม่ได้มีส่วนเกี่ยวข้องกับเมลชิ้นนี้
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
