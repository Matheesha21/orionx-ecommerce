import nodemailer from "nodemailer";

const buildMailer = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  const isProduction = process.env.NODE_ENV === "production";

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    if (!isProduction) {
      return {
        sendMail: async (message) => {
          console.warn("[mailer] SMTP not configured. Skipping email send in development.");
          console.warn(`[mailer] To: ${message.to}`);
          console.warn(`[mailer] Subject: ${message.subject}`);
          console.warn(`[mailer] Body: ${message.text}`);
          return { accepted: [], rejected: [message.to], skipped: true };
        },
      };
    }

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

  const result = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your ORIONX verification code",
    text: `Your ORIONX verification code is ${otp}. It expires in 10 minutes.`,
  });

  return result;
};
