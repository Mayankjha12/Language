"use client";

import { motion } from "framer-motion";

const steps = [
  "You ask or upload",
  "AI understands",
  "Smart action",
  "Done for you",
];

export default function WorkflowSection() {
  return (
    <section className="px-6 py-28 max-w-7xl mx-auto">

      {/* Heading */}
      <div className="text-center mb-20">

        <h2
          className="
            text-5xl
            md:text-6xl
            font-bold
            text-white
            tracking-tight
          "
        >
          The AI Workflow
        </h2>

        <p
          className="
            mt-5
            text-gray-400
            max-w-2xl
            mx-auto
            text-lg
          "
        >
          JanMitra AI simplifies complex government tasks
          into a smooth AI-powered experience.
        </p>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">

        {steps.map((step, index) => (
          <motion.div
            key={index}
            whileHover={{
              y: -8,
              scale: 1.02,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 18,
            }}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              backdrop-blur-xl
              p-8
              transition-all
              duration-500
              hover:border-purple-500/30
            "
          >

            {/* Soft Gradient Glow */}
            <div
              className="
                absolute
                inset-0
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
                bg-gradient-to-br
                from-purple-500/10
                via-blue-500/5
                to-cyan-500/10
              "
            />

            {/* Number */}
            <div className="relative z-10">

              <div
                className="
                  mb-6
                  text-5xl
                  font-extrabold
                  bg-gradient-to-r
                  from-purple-400
                  to-blue-500
                  bg-clip-text
                  text-transparent
                "
              >
                0{index + 1}
              </div>

              {/* Title */}
              <h3
                className="
                  text-2xl
                  font-semibold
                  text-white
                  leading-snug
                "
              >
                {step}
              </h3>

            </div>

            {/* Bottom Border Glow */}
            <div
              className="
                absolute
                bottom-0
                left-0
                h-[2px]
                w-0
                bg-gradient-to-r
                from-purple-500
                to-blue-500
                transition-all
                duration-500
                group-hover:w-full
              "
            />

          </motion.div>
        ))}

      </div>
    </section>
  );
}