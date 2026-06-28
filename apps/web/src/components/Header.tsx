"use client";

import Link from "next/link";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

export function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="bg-brand-black border-b border-white/[0.08] h-[60px] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-full px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-brand-orange w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>
          <span className="text-white font-semibold">PDFMark</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-white/65 hover:text-white text-sm font-medium transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-white/65 hover:text-white text-sm font-medium transition-colors">
            How It Works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-white/65 hover:text-white text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                Log in
              </Link>
              <Link href="/sign-up" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
