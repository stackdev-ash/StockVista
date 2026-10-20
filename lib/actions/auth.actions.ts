"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "@/database/models/user.model";
import { connectToDatabase } from "@/database/mongoose";
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/nodemailer";

export async function signUpWithEmail(data: SignUpFormData) {
  try {
    await connectToDatabase();

    const name = data.fullName.trim();
    const email = data.email.trim().toLowerCase();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        error: "Enter a valid name and email address.",
      };
    }

    if (typeof data.password !== "string" || data.password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters.",
      };
    }

    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match.",
      };
    }

    const existingUser = await User.findOne({ email }).select(
      "+verificationToken",
    );

    const rawVerificationToken = crypto.randomBytes(32).toString("hex");
    const verificationToken = crypto
      .createHash("sha256")
      .update(rawVerificationToken)
      .digest("hex");
    const verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    if (existingUser) {
      if (existingUser.verificationToken && !existingUser.emailVerified) {
        existingUser.verificationToken = verificationToken;
        existingUser.verificationTokenExpiry = verificationTokenExpiry;
        await existingUser.save();
        await sendVerificationEmail({ email, token: rawVerificationToken });
        return { success: true };
      }

      return {
        success: false,
        error: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      verificationToken,
      verificationTokenExpiry,
    });

    await sendVerificationEmail({
      email,
      token: rawVerificationToken,
    });

    await sendWelcomeEmail({
      email,
      name,
      intro: `
        <p style="font-size:16px;color:#CCDADC;line-height:1.6;">
          Thanks for joining StockVista. Verify your email to activate your
          account and start tracking stocks, creating alerts and building your watchlist.
        </p>
      `,
    }).catch((emailError) => {
      // A welcome-email delivery issue must not invalidate successful registration.
      console.error("Welcome email failed:", emailError);
    });

    return { success: true };
  } catch (error) {
    console.error("StockVista sign-up failed:", error);
    return {
      success: false,
      error:
        "Failed to create account or send verification email. Please try again.",
    };
  }
}
