"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("If an account exists for this email, a reset link has been sent.");

    // await fetch("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f8f8f8] to-[#eaeaea]">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Forgot Password</h1>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Enter your email</label>
            <input
              type="email"
              className="w-full rounded px-3 py-2 border focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-primary text-white font-bold py-2 rounded hover:bg-primary/80"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
