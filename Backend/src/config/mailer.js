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

export const sendQuotationConfirmation = async (email, firstName, product, quantity, attachmentPath) => {
  const transporter = buildMailer();

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  const htmlBody = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;">
      <h2>Quotation Request Received</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for submitting your quotation request. We've received your inquiry and our sales team will review it shortly.</p>
      <div style="background-color:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0;">
        <h3 style="margin-top:0;">Your Request Details:</h3>
        <p><strong>Product:</strong> ${product}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
      </div>
      <p>We will get back to you within 24 hours with a customized quotation. If you have any urgent questions, feel free to contact us.</p>
      <p>Best regards,<br/>ORIONX Sales Team</p>
      <p style="font-size:12px;color:#666;margin-top:30px;">
        <strong>ORIONX</strong><br/>
        Email: orionx2101@gmail.com<br/>
        Phone: +94 756498525<br/>
        Location: Panagoda, Colombo, Sri Lanka
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Quotation Request Received - ORIONX',
    html: htmlBody,
  };

  if (attachmentPath) {
    mailOptions.attachments = [
      {
        filename: `quotation_${Date.now()}.pdf`,
        path: attachmentPath,
      },
    ];
  }

  return transporter.sendMail(mailOptions);
};

export const sendContactNotification = async (contactMessage) => {
  const transporter = buildMailer();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM;

  if (!adminEmail) {
    throw new Error("Admin email not configured.");
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmail,
    subject: `New Contact Message: ${contactMessage.subject}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111;">
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${contactMessage.name}</p>
        <p><strong>Email:</strong> ${contactMessage.email}</p>
        <p><strong>Subject:</strong> ${contactMessage.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background:#f5f5f5;padding:15px;border-radius:6px;white-space:pre-wrap;">${contactMessage.message}</div>
      </div>
    `,
  });
};

export const sendContactReply = async (contactMessage, replyMessage) => {
  const transporter = buildMailer();

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: contactMessage.email,
    subject: `Re: ${contactMessage.subject} - ORIONX`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.6;">
        <h2>Reply from ORIONX</h2>
        <p>Hi ${contactMessage.name},</p>
        <p>Thanks for reaching out to ORIONX. Here is our reply to your message:</p>
        <div style="background:#f5f5f5;padding:15px;border-radius:6px;white-space:pre-wrap;margin:16px 0;">
          ${replyMessage}
        </div>
        <p>If you need anything else, you can reply to this email or contact us again from our website.</p>
        <p>Best regards,<br/>ORIONX Support Team</p>
        <p style="font-size:12px;color:#666;margin-top:24px;">
          ORIONX<br/>
          <a href="${frontendUrl}">Visit our store</a>
        </p>
      </div>
    `,
  });
};
