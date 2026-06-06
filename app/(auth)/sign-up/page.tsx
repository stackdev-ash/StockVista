"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "../../../lib/constants";
import FooterLink from "@/components/forms/FooterLink";
import { signUpWithEmail } from "../../../lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signUpWithEmail(data);
      if (result.success) {
        toast.success("Account created successfully");
        router.push("/sign-in");
      }
    } catch (e) {
      toast.error("Sign up failed", {
        description:
          e instanceof Error ? e.message : "Failed to create an account.",
      });
    }
  };

  return (
    <>
      <div className="auth-form-card z-10">
        <h1 className="form-title">Sign Up & Personalize</h1>

        <p className="form-subtitle">
          Start your investing journey with StockVista.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            register={register}
            error={errors.fullName}
            validation={{ required: "Full name is required", minLength: 2 }}
          />

          <InputField
            name="email"
            label="Email"
            placeholder="contact@jsmastery.com"
            register={register}
            error={errors.email}
            validation={{
              required: "Email name is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
              message: "Email address is required",
            }}
          />

          <InputField
            name="password"
            label="Password"
            placeholder="Enter a strong password"
            type="password"
            register={register}
            error={errors.password}
            validation={{ required: "Password is required", minLength: 8 }}
          />

          <SelectField
            name="investmentGoals"
            label="Investment Goals"
            placeholder="Select your investment goal"
            options={INVESTMENT_GOALS}
            control={control}
            error={errors.investmentGoals}
            required
          />

          <SelectField
            name="riskTolerance"
            label="Risk Tolerance"
            placeholder="Select your risk level"
            options={RISK_TOLERANCE_OPTIONS}
            control={control}
            error={errors.riskTolerance}
            required
          />

          <SelectField
            name="preferredIndustry"
            label="Preferred Industry"
            placeholder="Select your preferred industry"
            options={PREFERRED_INDUSTRIES}
            control={control}
            error={errors.preferredIndustry}
            required
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="cyan-btn w-full mt-5"
          >
            {isSubmitting ? "Creating Account" : "Start Your Investing Journey"}
          </Button>

          <FooterLink
            text="Already have an account?"
            linkText="Sign in"
            href="/sign-in"
          />
        </form>
      </div>
    </>
  );
};
export default SignUp;
