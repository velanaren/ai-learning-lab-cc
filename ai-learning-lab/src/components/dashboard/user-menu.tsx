"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronDown } from "lucide-react";

interface UserMenuProps {
  user: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const displayName = user.name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      {/* User Menu Trigger */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        data-testid="user-menu-button"
      >
        {/* User Avatar */}
        {user.image ? (
          <img
            src={user.image}
            alt={displayName}
            className="h-6 w-6 rounded-full border border-zinc-200"
          />
        ) : (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white"
            aria-hidden="true"
          >
            {initials}
          </div>
        )}

        {/* User Email (hidden on mobile) */}
        <span className="hidden max-w-[150px] truncate sm:inline">
          {user.email}
        </span>

        {/* Dropdown Icon */}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-12 z-50 w-64 animate-in fade-in slide-in-from-top-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg duration-200"
          role="menu"
          aria-orientation="vertical"
          data-testid="user-menu-dropdown"
        >
          {/* User Info */}
          <div className="border-b border-zinc-100 px-4 py-3">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={displayName}
                  className="h-10 w-10 rounded-full border border-zinc-200"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white">
                  {initials}
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                {user.name && (
                  <div className="truncate text-sm font-medium text-zinc-900">
                    {user.name}
                  </div>
                )}
                <div className="truncate text-xs text-zinc-600">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              role="menuitem"
              data-testid="sign-out-button"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
