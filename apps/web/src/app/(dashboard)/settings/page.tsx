"use client";

import { motion } from "framer-motion";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Settings as SettingsIcon, User, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { userId } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">Account</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="text-sm font-mono">{userId || "—"}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Profile</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">Session</CardTitle>
              <CardDescription>Sign out of your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UserButton afterSignOutUrl="/">
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </UserButton>
        </CardContent>
      </Card>
    </div>
  );
}
