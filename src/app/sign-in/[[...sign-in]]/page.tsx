"use client";

import Image from "next/image";
import { useState } from "react";

import { SignIn, SignUp } from "@clerk/nextjs";

import { signInLightAppearance } from "@/services/clerk/lib/signInAppearance";

type AuthMode = "sign-in" | "sign-up";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("sign-in");

  const handleToggle = () => {
    setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"));
  };

  const isSignIn = mode === "sign-in";

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src="/logo.svg"
            alt="Darasa"
            width={120}
            height={40}
            priority
          />
          <h1 className="text-xl font-semibold text-slate-900">
            {isSignIn ? "Welcome back" : "Join Darasa"}
          </h1>
          <p className="text-sm text-slate-600">
            {isSignIn
              ? "Sign in to continue to your dashboard."
              : "Join Darasa to start preparing for interviews."}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-lg shadow-slate-200/60 space-y-4">
          {isSignIn ? (
            <SignIn appearance={signInLightAppearance} routing="hash" />
          ) : (
            <SignUp appearance={signInLightAppearance} routing="hash" />
          )}
          <p className="text-sm text-slate-600 text-center">
            {isSignIn ? "New to Darasa?" : "Returning to Darasa?"}{" "}
            <button
              type="button"
              onClick={handleToggle}
              className="font-medium text-blue-600 underline-offset-4 hover:underline"
            >
              {isSignIn ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
