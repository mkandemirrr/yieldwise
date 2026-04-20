"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TrendingUp, PieChart, DollarSign, Search, MessageSquare, BarChart3, Bell, Settings, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: <BarChart3 size={18} /> },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: <PieChart size={18} /> },
  { label: "Dividends", href: "/dashboard/dividends", icon: <DollarSign size={18} /> },
  { label: "Screener", href: "/dashboard/screener", icon: <Search size={18} /> },
  { label: "AI Chat", href: "/dashboard/chat", icon: <MessageSquare size={18} /> },
  { label: "Signals", href: "/dashboard/signals", icon: <TrendingUp size={18} /> },
  { label: "Alerts", href: "/dashboard/alerts", icon: <Bell size={18} /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 240,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? "20px 16px" : "20px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: "var(--gradient-green)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <TrendingUp size={16} color="white" />
            </div>
            {!collapsed && (
              <span style={{ fontSize: 17, fontWeight: 800 }}>
                Yield<span style={{ color: "var(--accent)" }}>Wise</span>
              </span>
            )}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            background: "none", color: "var(--text-muted)", padding: 4,
          }}>
            {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "10px 16px" : "10px 14px",
                borderRadius: 8, fontSize: 14, fontWeight: active ? 600 : 400,
                color: active ? "var(--accent)" : "var(--text-secondary)",
                background: active ? "var(--accent-light)" : "transparent",
                transition: "all 0.2s",
                justifyContent: collapsed ? "center" : "flex-start",
              }}>
                {item.icon}
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: collapsed ? "10px 16px" : "10px 14px", width: "100%",
            borderRadius: 8, fontSize: 14, color: "var(--text-muted)",
            background: "transparent", transition: "all 0.2s",
            justifyContent: collapsed ? "center" : "flex-start",
          }}>
            <LogOut size={18} />
            {!collapsed && "Log Out"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
