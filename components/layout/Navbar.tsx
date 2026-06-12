"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-lg font-bold text-white">🏠 Home-in</h1>

        <div className="flex items-center gap-6 text-sm text-slate-300">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/search" className="hover:text-white">Search</Link>
          <Link href="/saved" className="hover:text-white">Saved</Link>
          <Link href="/compare" className="hover:text-white">Compare</Link>
          <Link href="/my-listings" className="hover:text-white">My Listings</Link>
          <Link href="/inquiries" className="hover:text-white">Inquiries</Link>
          <Link href="/post-listing" className="hover:text-white">Post Listing</Link>

          {isLoggedIn ? (
            <>
              <span className="text-slate-400">Hi, {user?.name}</span>
              <button onClick={handleLogout} className="hover:text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="hover:text-white">Sign In</Link>
              <Link href="/signup" className="hover:text-white">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}