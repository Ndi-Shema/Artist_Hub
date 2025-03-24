"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <button
        onClick={() => signIn("github")}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
