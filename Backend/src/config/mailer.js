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

export const sendNewsletter = async (email, products = [], extras = {}) => {
  const transporter = buildMailer();

  const subject = extras.subject || "Latest from ORIONX - New products & deals";

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const unsubscribeUrl = `${frontendUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  const htmlBody = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;">
      <h2>Latest Products & Discounts from ORIONX</h2>
      <p>Hi there — thanks for subscribing! Here are our latest products and current discounts.</p>
      <ul>
        ${products
          .map(
            (p) => `
          <li style="margin-bottom:10px">
            <strong>${p.name}</strong><br/>
            ${p.shortDescription || ''}<br/>
            Price: LKR ${p.price?.toFixed ? p.price.toFixed(2) : p.price}
            ${p.isOnSale ? `<br/><em>Discount: ${p.discountPercentage || 0}%</em>` : ''}
          </li>`
          )
          .join('')}
      </ul>
      <p>Visit our store to shop these items: <a href="${frontendUrl}">ORIONX Store</a></p>
      <p style="font-size:12px;color:#666">If you'd like to unsubscribe, <a href="${unsubscribeUrl}">click here</a>.</p>
    </div>
  `;

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: htmlBody,
  });
};
