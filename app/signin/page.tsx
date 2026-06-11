"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.", { id: "auth-toast" });
      return;
    }

    const success = await signIn(email, password);

    if (!success) {
      toast.error("Invalid email or password.", { id: "auth-toast" });
      return;
    }

    toast.success("Signed in successfully.", { id: "auth-toast" });
    router.push("/search");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="mt-2 text-slate-400">Welcome back to Home-in.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <div className="text-right">
  <Link
    href="/forgot-password"
    className="text-sm text-cyan-300 hover:text-cyan-200"
  >
    Forgot password?
  </Link>
</div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01]"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}