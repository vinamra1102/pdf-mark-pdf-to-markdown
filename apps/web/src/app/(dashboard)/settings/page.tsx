"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { Settings as SettingsIcon, User, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { userId } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-7 w-7 text-brand-orange" />
          <h1 className="text-3xl font-bold text-brand-black">Settings</h1>
        </div>
        <p className="text-brand-dark-gray">Manage your account and preferences</p>
      </div>

      <div className="bg-white border border-brand-light-gray rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-brand-dark-gray" />
            <div>
              <h3 className="text-base font-semibold text-brand-black">Account</h3>
              <p className="text-sm text-brand-dark-gray">Your account details</p>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-sm text-brand-dark-gray">User ID</p>
              <p className="text-sm font-mono text-brand-black">{userId || "---"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-brand-dark-gray">Profile</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-brand-light-gray rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <LogOut className="h-5 w-5 text-brand-dark-gray" />
            <div>
              <h3 className="text-base font-semibold text-brand-black">Session</h3>
              <p className="text-sm text-brand-dark-gray">Sign out of your account</p>
            </div>
          </div>
          <div className="pt-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </div>
  );
}
