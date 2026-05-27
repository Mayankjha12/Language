"use client";

import Link from "next/link";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Schemes", href: "/schemes" },
  { name: "Documents", href: "/documents" },
  { name: "Complaint", href: "/complaints" },
  { name: "Voice AI", href: "/voice" },
];

export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 bg-[#060816]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text"
        >
          JanMitra AI
        </Link>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-white transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition">
          Get Started
        </button>

      </div>
    </nav>
  );
}