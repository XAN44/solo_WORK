import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  userName: string,
) => {
  const resetLink = `${process.env.NEXT_PUBLIC_API_URL}auth/new-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Hello!! ${userName} Reset your password`,
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1d5db;">
          <h2 style="font-size: 24px; color: #1f2937;">Reset your password</h2>
          <p style="color: #4b5563;">
          You have submitted a password loan request. If you are the owner of the request Click the link below
          </p>
          <a
            href="${resetLink}"
            style="display: inline-block; margin: 16px 0; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
          <p style="color: #4b5563;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
  };

  await transporter.sendMail(mailOptions);
};
