"use client";

import { motion } from "framer-motion";
import { WavyBackground } from "../ui/wavy-background";

export default function HeroSection() {
  return (
    <WavyBackground
      containerClassName="
        min-h-screen
        flex
        items-center
        justify-center
        overflow-hidden
      "
      colors={[
        "#a855f7",
        "#6366f1",
        "#3b82f6",
        "#0891b2",
      ]}
      waveOpacity={0.5}
      blur={16}
      speed="slow"
    >

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">

        {/* Badge */}
       

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="
            text-5xl
            md:text-7xl
            font-extrabold
            leading-tight
            tracking-tight
            text-white
          "
        >
          Your government,
          <br />

          <span
            className="
              bg-gradient-to-r
              from-purple-400
              via-blue-400
              to-cyan-400
              bg-clip-text
              text-transparent
            "
          >
            decoded by AI.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.7,
          }}
          className="
            mt-8
            text-lg
            md:text-xl
            text-gray-300
            max-w-3xl
            mx-auto
            leading-relaxed
          "
        >
          JanMitra AI checks scheme eligibility,
          explains documents, files complaints,
          and talks to citizens in their own language.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.7,
          }}
          className="
            mt-12
            flex
            flex-col
            sm:flex-row
            justify-center
            items-center
            gap-5
          "
        >

          <button
            className="
              px-8
              py-4
              rounded-full
              bg-gradient-to-r
              from-purple-500
              to-blue-600
              text-white
              font-medium
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-2xl
              hover:shadow-purple-500/30
            "
          >
            Launch Dashboard
          </button>

          <button
            className="
              px-8
              py-4
              rounded-full
              border
              border-white/20
              bg-white/5
              backdrop-blur-md
              text-white
              font-medium
              transition-all
              duration-300
              hover:bg-white/10
              hover:scale-105
            "
          >
            Try Voice AI
          </button>

        </motion.div>

      </div>
    </WavyBackground>
  );
}