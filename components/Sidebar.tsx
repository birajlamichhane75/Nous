/**
 * Sidebar Navigation Component
 * 
 * Client-side navigation sidebar for the Nous learning platform.
 * Features:
 * - Logo and branding at top
 * - Main navigation: Dashboard, Assignments, Collaboration, Growth, Notifications
 * - Active route highlighting
 * - Logout link
 * - Responsive icon + label layout
 * 
 * Uses Lucide icons for navigation items and active state management
 * based on current pathname.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FileText, Users, LineChart, Bell, LogOut } from "lucide-react";
import { NousLogo } from "@/components/NousLogo";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Assignments", href: "/assignments", icon: FileText },
    { name: "Collaboration", href: "/collaboration", icon: Users },
    { name: "Growth", href: "/growth", icon: LineChart },
    { name: "Notifications", href: "/notifications", icon: Bell },
  ];

  return (
    <aside className="sidebar-container select-none">
      <div className="px-[20px] pt-[22px] pb-[18px] border-b border-black/5 sidebar-logo-container">
        <div className="flex items-center gap-[12px]">
          <NousLogo size={42} />
          <span className="text-[26px] font-[800] text-[#1A1A2E] tracking-[-0.8px] sidebar-logo-text" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Nous</span>
        </div>
      </div>

      <nav className="flex-1 p-[16px_12px] flex flex-col gap-[4px]">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) || 
                           (item.name === "Collaboration" && pathname.startsWith("/collaboration")) ||
                           (item.name === "Growth" && pathname.startsWith("/growth"));

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-[#1A1A2E]" : "text-[#6E6E73]"} />
              <span className="sidebar-nav-text">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-[16px_12px_24px] border-t border-black/5">
        <Link 
          href="/login" 
          className="nav-item"
        >
          <LogOut size={20} strokeWidth={1.5} className="text-[#6E6E73]" />
          <span className="sidebar-nav-text">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
