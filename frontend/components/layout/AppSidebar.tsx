"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useProjectStore } from "@/stores/project-store";
import {
  LayoutDashboard,
  Library,
  LogOut,
  Database,
  Layers,
  BarChart3,
  Calendar,
  MessageSquare,
  CheckSquare,
  Download,
  Zap,
} from "lucide-react";
import { clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const { currentProject } = useProjectStore();
  const router = useRouter();

  function handleLogout() {
    clearToken();
    clearAuth();
    router.push("/login");
  }

  const projectBase = currentProject ? `/projects/${currentProject.name}` : null;

  function navItem(
    href: string,
    icon: React.ReactNode,
    label: string,
    color?: string,
  ) {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
          isActive
            ? "bg-white/8 text-white"
            : "text-white/50 hover:text-white hover:bg-white/5",
        )}
      >
        <span style={color ? { color } : undefined}>{icon}</span>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <div className="w-64 flex-shrink-0 border-r border-white/6 flex flex-col bg-[#080e0c] h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg ios-gradient flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#080e0c]" />
          </div>
          <span className="font-bold text-sm ios-gradient-text">ImpactOS AI</span>
        </Link>
      </div>

      {/* Main nav */}
      <div className="p-3 space-y-1 border-b border-white/6">
        {navItem("/dashboard", <LayoutDashboard className="w-4 h-4" />, "My Projects")}
        {navItem("/templates", <Library className="w-4 h-4" />, "Templates")}
      </div>

      {/* Project MAP nav */}
      {projectBase && currentProject && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Project title */}
          <div className="px-2 py-1">
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
              Active Project
            </div>
            <div className="text-xs text-white/70 truncate">
              {currentProject.project_title}
            </div>
          </div>

          {/* M — Model */}
          <div>
            <div className="flex items-center gap-1.5 px-2 mb-1">
              <span className="text-[10px] font-bold text-[#00d4aa] uppercase tracking-wider">
                M
              </span>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">
                Model
              </span>
            </div>
            <div className="space-y-0.5">
              {navItem(
                `${projectBase}/data-model`,
                <Database className="w-3.5 h-3.5" />,
                "Data Model",
                "#00d4aa",
              )}
            </div>
          </div>

          {/* A — Align */}
          <div>
            <div className="flex items-center gap-1.5 px-2 mb-1">
              <span className="text-[10px] font-bold text-[#b8ff4f] uppercase tracking-wider">
                A
              </span>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">
                Align
              </span>
            </div>
            <div className="space-y-0.5">
              {navItem(
                `${projectBase}/modules`,
                <Layers className="w-3.5 h-3.5" />,
                "Module Specs",
                "#b8ff4f",
              )}
            </div>
          </div>

          {/* P — Power */}
          <div>
            <div className="flex items-center gap-1.5 px-2 mb-1">
              <span className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-wider">
                P
              </span>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">
                Power with AI
              </span>
            </div>
            <div className="space-y-0.5">
              {navItem(
                `${projectBase}/dashboards`,
                <BarChart3 className="w-3.5 h-3.5" />,
                "Dashboards",
                "#7c3aed",
              )}
              {navItem(
                `${projectBase}/sprint-plan`,
                <Calendar className="w-3.5 h-3.5" />,
                "Sprint Plan",
                "#7c3aed",
              )}
              {navItem(
                `${projectBase}/chat`,
                <MessageSquare className="w-3.5 h-3.5" />,
                "AI Chat",
                "#7c3aed",
              )}
            </div>
          </div>

          {/* Utilities */}
          <div className="pt-2 border-t border-white/6 space-y-0.5">
            {navItem(
              `${projectBase}/checklists`,
              <CheckSquare className="w-3.5 h-3.5" />,
              "Checklists",
            )}
            {navItem(
              `${projectBase}/export`,
              <Download className="w-3.5 h-3.5" />,
              "Export",
            )}
          </div>
        </div>
      )}

      {!projectBase && <div className="flex-1" />}

      {/* User footer */}
      <div className="p-3 border-t border-white/6">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-xs text-white truncate">
              {user?.fullName || user?.email}
            </div>
            <div className="text-[10px] text-white/40 capitalize">
              {user?.plan} plan
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
