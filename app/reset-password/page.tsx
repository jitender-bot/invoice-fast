"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set page metadata dynamically since this is a client component
  useEffect(() => {
    document.title = "Reset Password - InvoiceFast";
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setMessage(data.message);
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Token is invalid or has expired.");
      } else {
        setMessage("Password updated successfully! Redirecting to sign in...");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      {/* Reset Card */}
      <div className="w-full max-w-sm p-6 bg-background border border-border rounded-md shadow-xs select-text">
        <div className="text-center mb-6">
          <Link href="/" className="font-semibold text-lg text-text-primary tracking-tight">
            InvoiceFast
          </Link>
          <h1 className="text-xl font-bold text-text-primary mt-4">
            {token ? "Set New Password" : "Reset Password"}
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            {token
              ? "Choose a secure password for your account."
              : "Enter your email to receive a password reset link."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-danger/10 border border-danger/20 text-danger rounded-md text-xs text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-md text-xs text-center font-medium">
            {message}
          </div>
        )}

        {!token ? (
          /* Request Reset Link */
          <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-text-secondary">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full p-2 border border-border bg-background text-text-primary text-sm rounded-md outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-md shadow-sm transition-colors duration-150 cursor-pointer mt-2 text-center disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          /* Confirm Reset Link / Set Password */
          <form onSubmit={handleConfirmReset} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-text-secondary">
                New Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2 border border-border bg-background text-text-primary text-sm rounded-md outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-text-secondary">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2 border border-border bg-background text-text-primary text-sm rounded-md outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-md shadow-sm transition-colors duration-150 cursor-pointer mt-2 text-center disabled:opacity-50"
            >
              {loading ? "Updating password..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="text-center mt-6 pt-6 border-t border-border/80">
          <p className="text-xs text-text-secondary">
            Remembered your password?{" "}
            <Link href="/sign-in" className="text-accent font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
