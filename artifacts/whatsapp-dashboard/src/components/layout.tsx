import * as React from "react"
import { Link, useLocation } from "wouter"
import { 
  LayoutDashboard, 
  Users, 
  MessageSquareText, 
  Send
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const [location] = useLocation()

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/contacts", label: "Contacts & Dispatch", icon: Users },
    { href: "/messages", label: "Message Variations", icon: MessageSquareText },
  ]

  return (
    <div className={cn("pb-12 bg-sidebar text-sidebar-foreground border-r border-sidebar-border w-64 flex flex-col min-h-[100dvh]", className)} {...props}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground shadow-md">
              <Send className="w-4 h-4" />
            </div>
            Brandex.pk
          </h2>
          <p className="px-4 text-xs text-sidebar-foreground/60 mb-6 font-mono">Operations Panel</p>
          <div className="space-y-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block">
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    location === link.href 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-sidebar-border/50 text-xs text-sidebar-foreground/50 text-center">
        v1.0.0 — Salah Ud Din Siddiqui
      </div>
    </div>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar className="hidden md:flex flex-shrink-0" />
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
        {children}
      </main>
    </div>
  )
}
