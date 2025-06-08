"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Moon, Activity, Sparkles } from "lucide-react";
import { RefreshButton } from "./RefreshButton";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-200/20 bg-white/80 backdrop-blur-xl backdrop-saturate-150 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <span className="hidden xs:inline">Oura Dashboard</span>
              <span className="xs:hidden">Oura</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden md:block text-sm text-gray-500">
            Track your wellness journey
          </div>
          <RefreshButton />
          <nav className="flex items-center space-x-1">
            <Link
              href="/"
              className={cn(
                "flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all duration-200",
                pathname === "/" 
                  ? "bg-blue-100 text-blue-700 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Moon className="h-4 w-4" />
              <span className="font-medium text-sm sm:text-base">Sleep</span>
            </Link>
            <Link
              href="/activity"
              className={cn(
                "flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all duration-200",
                pathname === "/activity" 
                  ? "bg-blue-100 text-blue-700 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Activity className="h-4 w-4" />
              <span className="font-medium text-sm sm:text-base">Activity</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}