import nodemailer from 'nodemailer';
import {WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE , STOCK_ALERT_LOWER_EMAIL_TEMPLATE , STOCK_ALERT_UPPER_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `"StockVista" <StockVista@gmail.com>`,
        to: email,
        subject: `Welcome to StockVista - your stock market toolkit is ready!`,
        text: 'Thanks for joining StockVista',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"StockVista News" <StockVista@gmail.com>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from StockVista`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
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
  const html = STOCK_ALERT_UPPER_EMAIL_TEMPLATE
    .replace(/{{name}}/g, name)
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
  const html = STOCK_ALERT_LOWER_EMAIL_TEMPLATE
    .replace(/{{name}}/g, name)
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