"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-[120px]" />

      <div className="relative z-10 text-center px-6">

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="mx-auto mb-10 w-60 h-60 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 blur-2xl opacity-80"
        />

        <h1 className="text-6xl md:text-7xl font-bold leading-tight max-w-5xl mx-auto">
          Your government,
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
            decoded by AI.
          </span>
        </h1>

        <p className="mt-8 text-lg text-gray-400 max-w-2xl mx-auto">
          JanMitra AI checks scheme eligibility, explains documents,
          files complaints and talks to you in your language.
        </p>

        <div className="mt-10 flex justify-center gap-5">

          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition-all">
            Launch Dashboard
          </button>

          <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-all">
            Try Voice AI
          </button>

        </div>

      </div>
    </section>
  );
}