"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Schemes", href: "/schemes" },
  { name: "Documents", href: "/documents" },
  { name: "Complaint", href: "/complaints" },
  { name: "Voice AI", href: "/voice" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#060816]/80 backdrop-blur-xl">

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
        >
          JanMitra AI
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Button */}
        <div className="hidden md:block">
          <Button className="rounded-full px-6 bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
           <SheetTrigger asChild>
  <Button
    variant="ghost"
    size="icon"
    className="text-white hover:bg-white/10"
  >
    <Menu size={28} />
  </Button>
</SheetTrigger>

            <SheetContent
              side="right"
              className="bg-[#060816] border-white/10 text-white"
            >
              <div className="flex flex-col gap-6 mt-10">

                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg text-gray-300 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                ))}

                <Button className="mt-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
                  Get Started
                </Button>

              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}