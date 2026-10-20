import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import User from "@/database/models/user.model";
import { connectToDatabase } from "@/database/mongoose";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || token.length > 256) {
    return NextResponse.redirect(
      new URL("/verify-email?error=missing-or-invalid-token", request.url),
    );
  }

  try {
    await connectToDatabase();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
    }).select("+verificationToken +verificationTokenExpiry");

    if (!user) {
      return NextResponse.redirect(
        new URL("/verify-email?error=invalid-token", request.url),
      );
    }

    if (
      !user.verificationTokenExpiry ||
      user.verificationTokenExpiry.getTime() < Date.now()
    ) {
      return NextResponse.redirect(
        new URL("/verify-email?error=expired-token", request.url),
      );
    }

    user.emailVerified = new Date();
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    return NextResponse.redirect(
      new URL("/verify-email?status=success", request.url),
    );
  } catch (error) {
    console.error("Email verification failed:", error);
    return NextResponse.redirect(
      new URL("/verify-email?error=verification-failed", request.url),
    );
  }
}
