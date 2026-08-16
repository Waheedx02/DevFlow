// app/components/UserMenu.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { dark } from "@clerk/themes";

export function UserMenu() {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (!isLoaded) {
    return <div className="w-9 h-9 rounded-full bg-slate-800 animate-pulse" />;
  }

  if (!user) return null;

  const displayName = user.fullName || user.primaryEmailAddress?.emailAddress || "Account";
  const email = user.primaryEmailAddress?.emailAddress;
  const initial = (user.firstName?.[0] || user.primaryEmailAddress?.emailAddress?.[0] || "U").toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full transition hover:ring-2 hover:ring-slate-700 cursor-pointer"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover border border-slate-700"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">
            {initial}
          </div>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-[#13151b] shadow-2xl overflow-hidden z-50"
          role="menu"
        >
          {/* User info header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold shrink-0">
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              {email && <p className="text-xs text-slate-400 truncate">{email}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="py-1.5">
            <button
              onClick={() => {
                setOpen(false);
                openUserProfile({ theme: "dark" } as any);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition text-left cursor-pointer"
              role="menuitem"
            >
              <User size={16} className="text-slate-500" />
              Manage account
            </button>

            <button
              onClick={() => {
                setOpen(false);
                openUserProfile({ __experimental_startPath: "/security", theme: "dark" } as any);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition text-left cursor-pointer"
              role="menuitem"
            >
              <Settings size={16} className="text-slate-500" />
              Security settings
            </button>
          </div>

          <div className="border-t border-slate-800 py-1.5">
            <button
              onClick={() => {
                setOpen(false);
                signOut({ redirectUrl: "/" });
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition text-left cursor-pointer"
              role="menuitem"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}