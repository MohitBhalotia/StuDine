"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/src/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      className="flex items-center justify-center transition-colors"
      variant="outline"
      size="icon"
      onClick={(e) => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="rotate-0 transition-all dark:hidden dark:-rotate-90" />
      <Moon className="hidden rotate-90 transition-all dark:block dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
