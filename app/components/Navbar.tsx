"use client";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 sticky top-0 z-50">
      <Link className="flex items-center justify-center" href="/">
        <ShieldCheck className="h-6 w-6 mr-2 text-primary" />
        <span className="text-lg font-bold">Cypher</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:text-primary transition-colors"
          href="/#features"
        >
          Features
        </Link>
        <Link
          className="text-sm font-medium hover:text-primary transition-colors"
          href="/#about"
        >
          About
        </Link>
        <Link
          className="text-sm font-medium hover:text-primary transition-colors"
          href="/#github"
        >
          GitHub
        </Link>
      </nav>
      <div className="ml-4">
        <ModeToggle />
      </div>
    </header>
  );
}
