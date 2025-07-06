"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Target, BarChart3 } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/budgets",
      label: "Budgets",
      icon: Target,
    },
  ];

  return (
    <nav className="border-b border-white/20 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-lg relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-primary shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Finance Tracker</span>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "gradient" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 relative",
                      isActive && "shadow-lg"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
