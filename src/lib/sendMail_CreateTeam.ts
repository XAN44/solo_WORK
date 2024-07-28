import { format } from "date-fns";
import { th } from "date-fns/locale";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailWhenAdminCreateTeam = async (
  emails: string[],
  project: string,
  teamMembers: { name: string; email: string }[],
  supervisor: { name: string; email: string },
  detail: string,
  startAt: Date,
  endAt: Date,
) => {
  const formattedStartAt = format(startAt, "dd MMMM yyyy 'at' hh:mm a ", {
    locale: th,
  });
  const formattedEndAt = format(endAt, "dd MMMM yyyy 'at' hh:mm a ", {
    locale: th,
  });

  const confirmLink = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/team`;

  const memberList = teamMembers
    .map((member) => `<li>${member.name} (${member.email})</li>`)
    .join("");

  const mailOptions = {
    from: process.env.EMAIL,
    to: emails.join(","), // ใช้ join เพื่อแปลงเป็น string จาก array
    subject: `Team Created Successfully - ${project}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1d5db;">
        <h2 style="font-size: 24px; color: #1f2937;">Team Creation Notification</h2>
        <p style="color: #4b5563;">
          แอดมินได้ทำการสร้างทีมให้กับคุณในโปรเจค <strong>${project}</strong>. <br/>
          โดยมีรายละเอียดงานดังนี้ <br/>
            
           <strong> ${detail} </strong>
        </p>
        <p style="color: #4b5563;">
          Supervisor ของทีมคือ: <strong>${supervisor.name} (${supervisor.email})</strong>
        </p>
        <p style="color: #4b5563;">
          สมาชิกในทีมประกอบด้วย:
        </p>
        <ul>
          ${memberList}
        </ul>
         <p style="color: #4b5563;">
          ระยะเวลาเริ่มงาน: <strong>${formattedStartAt}</strong>
        </p>
        <p style="color: #4b5563;">
          ระยะเวลาสิ้นสุดงาน: <strong>${formattedEndAt}</strong>
        </p>
        <a
          href="${confirmLink}"
          style="display: inline-block; margin: 16px 0; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px;">
          Check assigned projects
        </a>
        <p style="color: #4b5563;">
          ขอภัย หากคุณไม่ได้มีส่วนเกี่ยวข้องกับเมลชิ้นนี้
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
