import Link from "next/link";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  "missing-or-invalid-token": "The verification link is missing a valid token.",
  "invalid-token":
    "This verification link is invalid or has already been used.",
  "expired-token":
    "This verification link has expired. Please sign up again or request a new link.",
  "verification-failed":
    "We could not verify your email right now. Please try again.",
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const verified = params.status === "success";
  const sent = params.status === "sent";
  const error = params.error
    ? (errorMessages[params.error] ?? "Email verification failed.")
    : null;

  return (
    <div className="auth-form-card z-10">
      <h1 className="form-title">
        {verified
          ? "Email Verified"
          : sent
            ? "Check Your Email"
            : "Email Verification"}
      </h1>

      <p className="form-subtitle">
        {verified
          ? "Your StockVista account is verified. You can now sign in with your email and password."
          : sent
            ? "We sent a verification link to your email address. Open it within one hour to activate your account."
            : (error ??
              "Open the verification link sent to your email address to activate your account.")}
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <Link
        href="/sign-in"
        className="cyan-btn mt-8 flex w-full items-center justify-center"
      >
        Go to Sign In
      </Link>

      {sent && (
        <p className="mt-4 text-center text-sm text-gray-500">
          If the email is not in your inbox, check your spam folder.
        </p>
      )}
    </div>
  );
}
