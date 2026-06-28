"use client";

import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-brand-black mb-2">Welcome Back</h1>
        <p className="text-brand-dark-gray mb-8">Authentication is not configured yet.</p>
        <Link href="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
