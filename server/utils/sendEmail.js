import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async ({ to, subject, text, html, headerColor }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Use provided HTML or build styled default template
    const emailHTML =
      html ||
      `
      <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:30px;">
        <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <div style="background:${headerColor || "#4F46E5"}; padding:20px; text-align:center; color:white;">
            <h1 style="margin:0; font-size:20px;">${subject}</h1>
          </div>
          <div style="padding:30px; color:#333; line-height:1.6;">
            <p style="font-size:16px; white-space:pre-line;">${text}</p>
            <p style="margin-top:20px; font-size:14px; color:#555;">
              Thank you,<br/>
              <strong>KLYTNFUND Team</strong>
            </p>
          </div>
          <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} KLYTNFUND. All rights reserved.
          </div>
        </div>
      </div>
    `;

    // Auto-generate plain text fallback if not provided
    const plainText = text || emailHTML.replace(/<[^>]*>?/gm, "");

    const mailOptions = {
      from: `"KLYTNFUND" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: plainText,
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};