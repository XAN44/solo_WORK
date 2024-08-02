import nodemailer from "nodemailer";
import { format } from "date-fns-tz";
import { enUS, th } from "date-fns/locale";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMailWithTimeOut = async (
  email: string,
  username: string,
  name: string,
  last: string,
  department: string,
  project: string,
  // startAt: Date | null,
  // endAt: Date | null,
  tasks: { title: string; status: string }[],
  type: string,
) => {
  const now = new Date();

  const formatDate = format(now, "dd MMMM yyyy 'at' hh:mm a", { locale: enUS });

  // const formatStartAt = format(new Date(startAt || ""), "dd MMM yyyy HH:mm a", {
  //   locale: enUS,
  // });

  // const formatEndAt = format(new Date(endAt || ""), "dd MMM yyyy HH:mm a", {
  //   locale: enUS,
  // });

  // Task details
  const taskDetails = tasks
    .map(
      (task) =>
        `<p>งาน: <strong>${task.title}</strong>, สถานะ: <strong>${task.status}</strong></p>`,
    )
    .join("");

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `รายงานการลงชื่อออกงานจากบัญชีผู้ใช้ ${username}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
        <h2 style="font-size: 24px; color: #1f2937; margin-bottom: 10px;">Notification of Time-Out</h2>
        <p style="color: #4b5563; margin-bottom: 15px;">
          นาย <strong>${name} นามสกุล ${last}</strong><br/><br/>
          แผนก <strong>${department}</strong><br/><br/>
          สมาชิกจากทีมที่รับผิดชอบเกี่ยวกับโปรเจค <strong>${project}</strong> <br/>
          ได้ดำเนินการลงชื่อออก<br/><br/>
        </p>

        <p style="color: #4b5563; margin-bottom: 15px;">
          รายละเอียดดังนี้:<br/><br/>
         
          <strong>สถานะการลงชื่อ: ${type}</strong><br/><br/>
          รายละเอียดงานที่ทำวันนี้:<br/><br/>
          ${taskDetails}
         </p>

        <p style="color: #4b5563;">
          ขออภัย หากคุณไม่ได้มีส่วนเกี่ยวข้องกับเมลชิ้นนี้
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
