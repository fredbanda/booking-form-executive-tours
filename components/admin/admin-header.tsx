"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminHeader() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin");
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">
              CT
            </span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            Executive Tours Admin
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}

