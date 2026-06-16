"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SelectField from "@/components/forms/SelectField";
import { Button } from "../ui/button";
import {
  INVESTMENT_GOALS,
  RISK_TOLERANCE_OPTIONS,
  PREFERRED_INDUSTRIES,
} from "@/lib/constants";

import {
  completeOnboarding,
  skipOnboarding,
} from "@/lib/actions/onboarding.actions";

interface OnboardingModalProps {
  userId: string;
}

const OnboardingModal = ({ userId }: OnboardingModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      investmentGoal: "",
      riskTolerance: "",
      preferredIndustry: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const result = await completeOnboarding({
      userId,
      ...data,
    });

    if (result.success) {
      toast.success("Preferences saved");

      router.refresh();
    }
  };

  const handleSkip = async () => {
    const result = await skipOnboarding(userId);

    if (result.success) {
      toast.success("Onboarding skipped");

      router.refresh();
    }
  };
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-gray-800 p-6">
        <h2 className="text-2xl font-bold text-white">Welcome to StockVista</h2>

        <p className="mt-2 text-gray-400">Let&apos;s personalize your experience.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <SelectField
            name="investmentGoal"
            label="Investment Goal"
            placeholder="Select goal"
            control={control}
            options={INVESTMENT_GOALS}
            error={errors.investmentGoal}
            required
          />

          <SelectField
            name="riskTolerance"
            label="Risk Tolerance"
            placeholder="Select risk level"
            control={control}
            options={RISK_TOLERANCE_OPTIONS}
            error={errors.riskTolerance}
            required
          />

          <SelectField
            name="preferredIndustry"
            label="Preferred Industry"
            placeholder="Select industry"
            control={control}
            options={PREFERRED_INDUSTRIES}
            error={errors.preferredIndustry}
            required
          />

          <Button type="submit" className="cyan-btn w-full">
            Continue
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="w-full"
          >
            Skip
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;
