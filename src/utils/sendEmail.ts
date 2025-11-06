import { transporter } from "@/config/mailer";
import { VerifyEmail } from "../../emails/verifyEmail";
import { render } from "@react-email/components";
import { ResetPassword } from "../../emails/ResetPassword";

export const sendEmail = async (to: string, subject: string, url: string, type: "verifyEmail" | "resetPassword") => {
  if (type=== "verifyEmail") {
  const mail = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: await render(VerifyEmail({ url })),
  });
  return mail;
  } else if (type=== "resetPassword") {
    const mail = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: await render(ResetPassword({ url })),
    });
    return mail;
  }
};
