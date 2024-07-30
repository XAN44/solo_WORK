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

export const sendWithLeaveRequest = async (
  id: string,
  title: string,
  email: string,
  name: string,
  last: string,
  username: string,
  department: string,
  typeleave: string,
  tel: string,
  reason: string,
  leaveDateStart: Date,
  leaveDateEnd: Date,
  statusLeave: string,
  leaveDuration: number,
) => {
  const now = new Date();
  const confirmLink = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/leavequest/${id}`;
  const formatStartAt = format(leaveDateStart, "dd MMMM yyyy 'at' hh:mm a", {
    locale: th,
  });
  const formatEndAt = format(leaveDateEnd, "dd MMMM yyyy 'at' hh:mm a", {
    locale: th,
  });

  // แปลค่า createAt เป็นข้อความ

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `แจ้งลางานจากบัญชีผู้ใช้ ${username} ในหัวข้อ ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
        <h2 style="font-size: 24px; color: #1f2937; margin-bottom: 10px;">Member Create Task Notification</h2>
        <p style="color: #4b5563; margin-bottom: 15px;">
           หมายเหตุจาก <strong>${name}</strong> นามสกุล <strong>${last}</strong><br/>
          แผนก <strong>${department}</strong><br/><br/>
          ได้ทำการขออนุญาติลางานเนื่องด้วยเหตุผล <strong>${reason}</strong>   
        </p>

    

        <p style="color: #4b5563; margin-bottom: 15px;">
          ประเภทของการลางาน: <strong>${typeleave}</strong><br/>
          เริ่มลาเมื่อวันที่: <strong>${formatStartAt}</strong><br/>
          ระยะเวลาสิ้นสุด: <strong>${formatEndAt}</strong> <br/>
          ระยะเวลาทั้งสิ้น: <strong> ${leaveDuration} </strong>  <br/>
          ช่องทางติดต่อ: <strong>${tel}</strong>

        </p>

        <p style="color: #4b5563; margin-bottom: 15px;">
          สถานะการลา: <strong>${statusLeave}</strong>
        </p>
        <a
            href="${confirmLink}"
            style="display: inline-block; margin: 16px 0; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px;">
            ตรวจสอบรายละเอียด
          </a>
        <p style="color: #4b5563;">
          ขออภัย หากคุณไม่ได้มีส่วนเกี่ยวข้องกับเมลชิ้นนี้
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
