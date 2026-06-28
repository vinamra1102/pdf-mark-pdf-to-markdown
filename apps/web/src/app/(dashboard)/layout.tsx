"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex pt-[60px]">
        <Sidebar />
        <main className="flex-1 p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}
