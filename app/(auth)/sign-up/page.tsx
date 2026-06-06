"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";
import { signIn } from "next-auth/react";
import { signUpWithEmail } from "../../../lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const payload = {
        ...data,
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
      };

      const result = await signUpWithEmail(payload);

      if (!result.success) {
        toast.error(result.error || "Failed to create account");
        return;
      }

      const loginResult = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (loginResult?.error) {
        toast.error("Account created but login failed");
        router.push("/sign-in");
        return;
      }

      toast.success("Account created successfully");

      router.push("/");
      router.refresh();
    } catch (e) {
      toast.error("Sign up failed", {
        description:
          e instanceof Error ? e.message : "Failed to create an account.",
      });
    }
  };

  return (
    <>
      <div className="auth-form-card signup-form-card z-10">
        <h1 className="form-title">Create Account</h1>

        <p className="signup-subtitle">Start your investing journey with StockVista.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
          <InputField
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            register={register}
            error={errors.fullName}
            validation={{
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
          />

          <InputField
            name="email"
            label="Email"
            placeholder="contact@jsmastery.com"
            register={register}
            error={errors.email}
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
          />

          <InputField
            name="password"
            label="Password"
            placeholder="Enter a strong password"
            type="password"
            register={register}
            error={errors.password}
            validation={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
          />

          <InputField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            register={register}
            error={errors.confirmPassword}
            validation={{
              required: "Please confirm your password",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="cyan-btn w-full mt-5"
          >
            <span className="flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating Account..." : "Get Started"}
            </span>
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
