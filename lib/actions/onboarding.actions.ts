"use server";

import User from "@/database/models/user.model";
import { connectToDatabase } from "@/database/mongoose";

interface OnboardingData {
  userId: string;
  investmentGoal: string;
  riskTolerance: string;
  preferredIndustry: string;
}

export async function completeOnboarding(data: OnboardingData) {
  try {
    await connectToDatabase();

    await User.findByIdAndUpdate(data.userId, {
      investmentGoal: data.investmentGoal,
      riskTolerance: data.riskTolerance,
      preferredIndustry: data.preferredIndustry,
      onboardingCompleted: true,
    });

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to save onboarding data",
    };
  }
}

export async function skipOnboarding(userId: string) {
  try {
    await connectToDatabase();

    await User.findByIdAndUpdate(userId, {
      onboardingCompleted: true,
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Failed to skip onboarding",
    };
  }
}