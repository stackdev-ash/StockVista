"use server";

import bcrypt from "bcryptjs";

import User from "@/database/models/user.model";
import { connectToDatabase } from "@/database/mongoose";

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

    const hashedPassword = await bcrypt.hash(
      data.password,
      10
    );

    await User.create({
      name: data.fullName.trim(),
      email,
      password: hashedPassword,
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