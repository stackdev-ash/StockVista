"use server";

import bcrypt from "bcryptjs";

import User from "@/database/models/user.model";
import { connectToDatabase } from "@/database/mongoose";
import { sendWelcomeEmail } from "../nodemailer/index";

export async function signUpWithEmail(data: SignUpFormData) {
  try {
    await connectToDatabase();

    const email = data.email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return {
        success: false,
        error: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await User.create({
      name: data.fullName.trim(),
      email,
      password: hashedPassword,
    });

    sendWelcomeEmail({
      email,
      name: data.fullName.trim(),
      intro: `
    <p style="font-size:16px;color:#CCDADC;line-height:1.6;">
      Thanks for joining StockVista.
      Your account is now ready and you can start tracking stocks,
      creating alerts and building your watchlist.
    </p>
  `,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to create account",
    };
  }
}
