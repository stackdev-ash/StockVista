"use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";

const SignIn = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Signed in successfully");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Sign in failed", {
        description:
          error instanceof Error ? error.message : "Failed to sign in.",
      });
    }
  };

  return (
    <>
      <div className="auth-form-card z-10">
        <h1 className="form-title">Welcome Back</h1>

        <p className="form-subtitle">
          Sign in to access your watchlist and market insights.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            name="email"
            label="Email"
            placeholder="contact@stockvista.com"
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
            placeholder="Enter your password"
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="cyan-btn w-full mt-5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <FooterLink
            text="Don't have an account?"
            linkText="Create an account"
            href="/sign-up"
          />
        </form>
      </div>
    </>
  );
};

export default SignIn;
