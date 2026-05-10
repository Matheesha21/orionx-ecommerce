import nodemailer from "nodemailer";

const buildMailer = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error(
      "SMTP configuration missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM."
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export const sendOtpEmail = async (email, otp) => {
  const transporter = buildMailer();

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your ORIONX verification code",
    text: `Your ORIONX verification code is ${otp}. It expires in 10 minutes.`,
  });
};
