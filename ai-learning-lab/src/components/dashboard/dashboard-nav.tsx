"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Calendar, Database, Settings, Menu, X, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    name: "Today",
    href: "/dashboard/today",
    icon: Calendar,
  },
  {
    name: "Memory",
    href: "/dashboard/memory",
    icon: Database,
  },
  {
    name: "Review",
    href: "/dashboard/review",
    icon: CalendarCheck,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className="hidden items-center gap-1 md:flex"
        role="navigation"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${
                isActive
                  ? "bg-zinc-900 text-white shadow-sm hover:bg-zinc-800"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
              aria-current={isActive ? "page" : undefined}
              data-testid={`nav-${item.name.toLowerCase()}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle mobile menu"
        aria-expanded={mobileMenuOpen}
        data-testid="mobile-menu-button"
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </Button>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div
          className="absolute left-0 right-0 top-16 z-40 border-b border-zinc-200/60 bg-white/95 backdrop-blur-sm shadow-lg md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
          role="navigation"
          aria-label="Mobile navigation"
          data-testid="mobile-menu"
        >
          <div className="container mx-auto flex flex-col gap-2 px-6 py-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-full px-5 py-3 text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
