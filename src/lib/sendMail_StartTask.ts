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

export const sendMailWithCreateTask = async (
  email: string,
  username: string,
  name: string,
  last: string,
  department: string,
  supervisor: string,
  project: string,
  task: string,
  statusTask: string,
  startAt: Date,
  endAt: Date,
  description: string,
  typeOfWork: string,
  createAt: string,
) => {
  const now = new Date();

  const formatDate = format(now, "dd MMMM yyyy 'at' hh:mm a", { locale: th });
  const formatStartAt = format(startAt, "dd MMMM yyyy 'at' hh:mm a", {
    locale: th,
  });
  const formatEndAt = format(endAt, "dd MMMM yyyy 'at' hh:mm a", {
    locale: th,
  });

  // แปลค่า createAt เป็นข้อความ
  const createAtDescription =
    createAt === CreateAt.Backdate ? "งานย้อนหลัง" : "งานปกติ";

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `สร้างงานในหัวข้อ ${task} จากบัญชีผู้ใช้ ${username}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
        <h2 style="font-size: 24px; color: #1f2937; margin-bottom: 10px;">Member Create Task Notification</h2>
        <p style="color: #4b5563; margin-bottom: 15px;">
          เรียนคุณ <strong>${supervisor}</strong> ที่เคารพ,<br/><br/>
          ผมนาย <strong>${name}</strong> นามสกุล <strong>${last}</strong><br/>
          แผนก <strong>${department}</strong><br/><br/>
          ได้ทำการสร้างงาน <strong>${task}</strong> จาก Project หลักที่ได้รับมอบหมาย <strong>${project}</strong>.<br/><br/>
        </p>

        <p style="color: #4b5563; margin-bottom: 15px;">
          โดยมีรายละเอียดงานดังนี้:<br/><br/>
          <strong>${description}</strong>
        </p>

        <p style="color: #4b5563; margin-bottom: 15px;">
          ประเภทของงาน: <strong>${typeOfWork}</strong><br/>
          ประเภทการลงทะเบียน: <strong>${createAtDescription}</strong><br/><br/>
          เริ่มงานเมื่อ <strong>${formatDate}</strong><br/>
          ระยะเวลาเริ่มงาน: <strong>${formatStartAt}</strong><br/>
          ระยะเวลาสิ้นสุดงาน: <strong>${formatEndAt}</strong>
        </p>

        <p style="color: #4b5563; margin-bottom: 15px;">
          สถานะงานที่ได้รับมอบหมาย: <strong>${statusTask}</strong>
        </p>

        <p style="color: #4b5563;">
          ขออภัย หากคุณไม่ได้มีส่วนเกี่ยวข้องกับเมลชิ้นนี้
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
