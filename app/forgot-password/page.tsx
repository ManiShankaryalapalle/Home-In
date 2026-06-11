"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

const AUTH_ACCOUNT_KEY = "home-in-account";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function handleReset(e: React.FormEvent) {
    e.preventDefault();

    const storedAccount = localStorage.getItem(AUTH_ACCOUNT_KEY);

    if (!storedAccount) {
      toast.error("No account found.", { id: "reset-toast" });
      return;
    }

    const account = JSON.parse(storedAccount);

    if (account.email !== email) {
      toast.error("Email does not match any account.", { id: "reset-toast" });
      return;
    }

    if (!newPassword.trim()) {
      toast.error("Please enter a new password.", { id: "reset-toast" });
      return;
    }

    const updatedAccount = {
      ...account,
      password: newPassword,
    };

    localStorage.setItem(AUTH_ACCOUNT_KEY, JSON.stringify(updatedAccount));

    toast.success("Password reset successfully.", { id: "reset-toast" });
    setEmail("");
    setNewPassword("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="mt-2 text-slate-400">
          Enter your account email and set a new password.
        </p>

        <form onSubmit={handleReset} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01]"
          >
            Reset Password
          </button>
        </form>

        <Link
          href="/signin"
          className="mt-6 inline-block text-sm text-cyan-300 hover:text-cyan-200"
        >
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}