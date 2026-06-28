"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col bg-brand-black w-[220px] min-h-screen border-r border-white/[0.08] p-4 gap-2 sticky top-[60px]">
      <div className="flex items-center gap-2 px-2 py-3 mb-4">
        <div className="bg-brand-orange w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>
        <span className="text-white font-semibold">PDFMark</span>
      </div>

      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors",
              isActive
                ? "bg-brand-orange/10 text-brand-orange border-l-2 border-brand-orange"
                : "text-white/55 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
