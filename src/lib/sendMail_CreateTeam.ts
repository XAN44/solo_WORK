import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailWhenAdminCreateTeam = async (email: string[]) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/team`;
  const mailOptions = {
    form: process.env.EMAIL,
    to: email.join(","),
    subject: "Team Created Successfully",
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1d5db;">
          <h2 style="font-size: 24px; color: #1f2937;">Confirm your email</h2>
          <p style="color: #4b5563;">
            Admin has created a team for you.
          </p>
          <a
            href="${confirmLink}"
            style="display: inline-block; margin: 16px 0; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px;">
            Confirm Email
          </a>
          <p style="color: #4b5563;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
  };
  await transporter.sendMail(mailOptions);
};
