"use client";

import { Settings as SettingsIcon, User } from "lucide-react";

export default function SettingsPage() {
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
              <p className="text-sm text-brand-dark-gray">Authentication is currently disabled.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
