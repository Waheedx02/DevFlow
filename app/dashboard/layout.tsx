"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Menu, Code, Plus, Home, FileCode, X, HelpCircle } from "lucide-react";
import { UserMenu } from "@/app/components/UserMenu";
import { WelcomeToast } from "@/app/components/WelcomeToast";
import { SnippetUsageBadge } from "@/app/components/SnippetUsageBadge";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, isLoaded } = useUser();
    const pathname = usePathname();

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Breadcrumb navigation based on current route
    const getBreadcrumbs = () => {
        const segments = pathname.split("/").filter(Boolean);
        const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }];

        if (segments.includes("my-snippets")) {
            breadcrumbs.push({ label: "My Snippets", href: "/dashboard/my-snippets" });
        } else if (segments.includes("add")) {
            breadcrumbs.push({ label: "Add Snippet", href: "/dashboard/add" });
        } else if (segments.includes("snippet") && segments[segments.indexOf("snippet") + 1]) {
            breadcrumbs.push({ label: "Snippet Detail", href: "#" });
            if (segments.includes("edit")) {
                breadcrumbs.push({ label: "Edit", href: "#" });
            }
        }

        return breadcrumbs;
    };

    const navLinkClass = (href: string) => {
        const isActive = pathname === href;
        return `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            isActive
                ? "text-white bg-cyan-500/10 border-l-2 border-cyan-400"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
        }`;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <div className="flex h-screen overflow-hidden bg-[#0f1117] text-slate-200 font-sans antialiased">
            <WelcomeToast />

            {/* Backdrop for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-all"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:relative z-40 h-full w-64 flex flex-col border-r border-slate-800/60 bg-[#17191f] transition-all duration-300 ease-out transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                {/* Sidebar header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50">
                    <Link
                        href="/dashboard"
                        onClick={closeSidebar}
                        className="flex items-center gap-2 text-xl font-bold text-white hover:opacity-80 transition"
                    >
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-cyan-500/10 text-cyan-400">
                            <Code size={16} strokeWidth={2.5} />
                        </span>
                        <span className="hidden sm:inline">DevFlow</span>
                    </Link>
                    <button
                        onClick={closeSidebar}
                        className="p-1.5 rounded hover:bg-slate-800 transition text-slate-400 hover:text-white md:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Create Button */}
                <div className="px-4 py-4">
                    <Link
                        href="/dashboard/add"
                        onClick={closeSidebar}
                        className="w-full flex items-center justify-center gap-2 rounded-full text-sm font-bold text-slate-950 bg-cyan-500 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20 active:scale-[0.98] py-2.5 px-4"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Create</span>
                    </Link>
                </div>

                {/* Snippet Usage Badge */}
                <div className="px-4 py-2">
                    <SnippetUsageBadge />
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    <Link
                        href="/dashboard"
                        onClick={closeSidebar}
                        className={navLinkClass("/dashboard")}
                    >
                        <Home size={18} />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                    <Link
                        href="/dashboard/my-snippets"
                        onClick={closeSidebar}
                        className={navLinkClass("/dashboard/my-snippets")}
                    >
                        <FileCode size={18} />
                        <span className="hidden sm:inline">My Snippets</span>
                    </Link>
                    <div className="pt-4 mt-2 border-t border-slate-800/60">
                        <Link
                            href="/dashboard/add"
                            onClick={closeSidebar}
                            className={navLinkClass("/dashboard/add")}
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add Snippet</span>
                        </Link>
                    </div>
                </nav>

                {/* User card at bottom */}
                {isLoaded && user && (
                    <div className="p-3 border-t border-slate-800/60">
                        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition">
                            {user.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt={user.fullName || "User"}
                                    className="w-9 h-9 rounded-full object-cover border border-slate-700"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                                    {(user.firstName?.[0] || user.primaryEmailAddress?.emailAddress?.[0] || "U").toUpperCase()}
                                </div>
                            )}
                            <div className="overflow-hidden flex-1 hidden sm:block">
                                <div className="text-sm font-semibold text-white truncate">
                                    {user.fullName || "Developer"}
                                </div>
                                <div className="text-xs text-slate-500 truncate">
                                    {user.primaryEmailAddress?.emailAddress || "Signed In"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-20 h-16 flex items-center justify-between gap-4 px-4 sm:px-6 border-b border-slate-800/60 bg-[#0f1117]/95 backdrop-blur-sm">
                    {/* Mobile menu + Breadcrumb */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition md:hidden shrink-0"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Breadcrumb - hidden on small screens */}
                        <nav className="hidden sm:flex items-center gap-2 text-sm min-w-0">
                            {breadcrumbs.map((crumb, i) => (
                                <div key={i} className="flex items-center gap-2 min-w-0">
                                    {i > 0 && <span className="text-slate-600 shrink-0">/</span>}
                                    {crumb.href === "#" ? (
                                        <span className="text-slate-400 truncate">{crumb.label}</span>
                                    ) : (
                                        <Link
                                            href={crumb.href}
                                            className="text-slate-400 hover:text-slate-300 transition truncate"
                                        >
                                            {crumb.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Right side: Help + Profile */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <a
                            href="#"
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            title="Help & Documentation"
                            aria-label="Help"
                        >
                            <HelpCircle size={18} />
                        </a>

                        <div className="w-px h-6 bg-slate-800 hidden sm:block" />

                        <UserMenu />
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;