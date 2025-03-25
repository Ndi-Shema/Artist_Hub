"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign-up failed");
      } else {
        setSuccess("User created successfully! You can now log in.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f8f8f8] to-[#eaeaea] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-10"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")',
        }}
      />

      <div className="z-10 w-full max-w-md bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Sign Up</h1>

        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-2 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              className="w-full rounded px-3 py-2 border focus:outline-none"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              className="w-full rounded px-3 py-2 border focus:outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              className="w-full rounded px-3 py-2 border focus:outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-primary text-white font-bold py-2 rounded hover:bg-primary/80"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
