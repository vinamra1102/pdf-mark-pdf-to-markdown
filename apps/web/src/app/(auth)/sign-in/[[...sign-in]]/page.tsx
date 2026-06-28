"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-black mb-2">Welcome Back</h1>
          <p className="text-brand-dark-gray">Sign in to your PDFMark account</p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white border border-brand-light-gray shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
