"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f8f8f8] to-[#eaeaea] relative overflow-hidden">
      {/* Some subtle lines or shapes in the background: */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-10"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")',
        }}
      />
      <div className="z-10 w-full max-w-md bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Login</h1>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div>
            <label className="block text-gray-700 font-medium mb-1">Enter your password</label>
            <input
              type="password"
              className="w-full rounded px-3 py-2 border focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
            <div>
              <input type="checkbox" id="remember" className="mr-1" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-primary text-white font-bold py-2 rounded hover:bg-primary/80"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
