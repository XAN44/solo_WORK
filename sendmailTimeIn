import nodemailer from "nodemailer";
import { format, toZonedTime } from "date-fns-tz";
import { enUS } from "date-fns/locale";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMailWithTimeIn = async (
  email: string,
  role: string,
  job: string,
  name: string,
  last: string,
  department: string,
  startAt: Date | null,
) => {
  // ใช้เขตเวลาที่ต้องการ (เช่น 'Asia/Bangkok')
  const timeZone = "Asia/Bangkok";

  // แปลงเวลาจาก UTC เป็นเขตเวลาของผู้ใช้
  const zonedDate = toZonedTime(startAt || "", timeZone);

  // ฟอร์แมตเวลาให้ตรงกับเขตเวลา
  const formatStartAt = format(zonedDate, "dd MMM yyyy HH:mm a", {
    locale: enUS,
    timeZone,
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `รายงานการลงชื่อจาก ${name} นามสกุล ${last}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
        <h2 style="font-size: 24px; color: #1f2937; margin-bottom: 10px;">Notification of Time-In</h2>
        <p style="color: #4b5563; margin-bottom: 15px;">
          ชื่อ<strong>${name} </strong> นามสกุล <strong>${last} <strong/> <br/> 
          แผนก:<strong>${department}</strong><br/> 
          ตำแหน่ง:<strong> ${job} ${role}</strong> <br/>
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
