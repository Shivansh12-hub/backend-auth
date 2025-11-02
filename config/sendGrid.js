import sgMail from "@sendgrid/mail";
import 'dotenv/config';
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
export const transporter = async ({ to, subject, html, text }) => {
  const msg = {
    to,
    from: process.env.SENDER_EMAIL,
    subject,
    text: text || "",
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent to:", to);
    return true;
  } catch (error) {
    console.error(" Error sending email:", error.response?.body || error.message);
    return false;
  }
};
