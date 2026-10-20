import nodemailer from "nodemailer";
import {
  WELCOME_EMAIL_TEMPLATE,
  NEWS_SUMMARY_EMAIL_TEMPLATE,
  STOCK_ALERT_LOWER_EMAIL_TEMPLATE,
  STOCK_ALERT_UPPER_EMAIL_TEMPLATE,
} from "@/lib/nodemailer/templates";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

export const sendVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const baseUrl = (
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
  const verificationLink = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: `"StockVista" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: "Verify your StockVista email",
    text: `Verify your StockVista email using this link: ${verificationLink}. This link expires in one hour.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:560px;margin:auto">
        <h2>Welcome to StockVista</h2>
        <p>Confirm your email address to activate your account.</p>
        <p><a href="${verificationLink}" style="display:inline-block;padding:12px 24px;background:#0891b2;color:#fff;text-decoration:none;border-radius:8px">Verify Email</a></p>
        <p>This link expires in one hour. If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  });
};

export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro,
  );

  await transporter.sendMail({
    from: `"StockVista" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: "Welcome to StockVista - your stock market toolkit is ready!",
    text: "Thanks for joining StockVista",
    html: htmlTemplate,
  });
};

export const sendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}): Promise<void> => {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace(
    "{{date}}",
    date,
  ).replace("{{newsContent}}", newsContent);

  await transporter.sendMail({
    from: `"StockVista News" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: "Today's market news summary from StockVista",
    html: htmlTemplate,
  });
};

export const sendUpperAlertEmail = async ({
  email,
  name,
  symbol,
  company,
  currentPrice,
  targetPrice,
}: {
  email: string;
  name: string;
  symbol: string;
  company: string;
  currentPrice: number;
  targetPrice: number;
}) => {
  const html = STOCK_ALERT_UPPER_EMAIL_TEMPLATE.replace(/{{name}}/g, name)
    .replace(/{{symbol}}/g, symbol)
    .replace(/{{company}}/g, company)
    .replace(/{{currentPrice}}/g, `$${currentPrice.toFixed(2)}`)
    .replace(/{{targetPrice}}/g, `$${targetPrice.toFixed(2)}`);

  return transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: `🚀 ${symbol} crossed your target price`,
    html,
  });
};

export const sendLowerAlertEmail = async ({
  email,
  name,
  symbol,
  company,
  currentPrice,
  targetPrice,
}: {
  email: string;
  name: string;
  symbol: string;
  company: string;
  currentPrice: number;
  targetPrice: number;
}) => {
  const html = STOCK_ALERT_LOWER_EMAIL_TEMPLATE.replace(/{{name}}/g, name)
    .replace(/{{symbol}}/g, symbol)
    .replace(/{{company}}/g, company)
    .replace(/{{currentPrice}}/g, `$${currentPrice.toFixed(2)}`)
    .replace(/{{targetPrice}}/g, `$${targetPrice.toFixed(2)}`);

  return transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: `📉 ${symbol} dropped below your target price`,
    html,
  });
};
