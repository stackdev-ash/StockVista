import { NextResponse } from "next/server";
import { signUpWithEmail } from "@/lib/actions/auth.actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await signUpWithEmail({
      fullName: typeof body.name === "string" ? body.name : "",
      email: typeof body.email === "string" ? body.email : "",
      password: typeof body.password === "string" ? body.password : "",
      confirmPassword:
        typeof body.confirmPassword === "string"
          ? body.confirmPassword
          : typeof body.password === "string"
            ? body.password
            : "",
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created. Please verify your email before signing in.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Sign-up endpoint failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create account." },
      { status: 500 },
    );
  }
}
