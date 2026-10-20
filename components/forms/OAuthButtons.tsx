"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function OAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        className="h-12 min-w-0 w-full justify-center whitespace-nowrap px-2 text-sm border-white/10 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <FcGoogle className="mr-2 h-4 w-4 shrink-0" />
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-12 min-w-0 w-full justify-center whitespace-nowrap px-2 text-sm border-white/10 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
        onClick={() => signIn("github", { callbackUrl: "/" })}
      >
        <FaGithub className="mr-2 h-4 w-4 shrink-0" />
        Continue with GitHub
      </Button>
    </div>
  );
}
