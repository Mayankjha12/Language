"use client";

import React, { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface MovingCardProps {
  children: ReactNode;
  className?: string;
}

export function MovingCard({
  children,
  className = "",
}: MovingCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        scale: 1.03,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 18,
      }}
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-8
        transition-all
        duration-500
        hover:border-purple-500/40
        hover:bg-white/10
        ${className}
      `}
    >
      {/* Glow Effect */}
      <div
        className="
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
          bg-gradient-to-r
          from-purple-500/10
          via-blue-500/10
          to-cyan-500/10
          blur-2xl
        "
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

interface InfiniteMovingCardsProps {
  items: any[];
  className?: string;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
}

export function InfiniteMovingCards({
  items,
  className = "",
  direction = "left",
  speed = "normal",
}: InfiniteMovingCardsProps) {

  const [isPaused, setIsPaused] = useState(false);

  const speedMap = {
    slow: 45,
    normal: 28,
    fast: 16,
  };

  const duration = speedMap[speed];
  const isLeft = direction === "left";

  return (
    <div
      className={`
        relative
        overflow-hidden
        w-full
        ${className}
      `}
    >
      {/* Left Fade */}
      <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#050816] to-transparent pointer-events-none" />

      {/* Right Fade */}
      <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#050816] to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-8 w-max py-4"
        animate={
          isPaused
            ? {}
            : {
                x: isLeft
                  ? ["0%", "-50%"]
                  : ["-50%", "0%"],
              }
        }
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="
              min-w-[320px]
              max-w-[320px]
              flex-shrink-0
            "
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <MovingCard>

              {/* Optional Icon */}
              {item.icon && (
                <item.icon
                  className="
                    w-10
                    h-10
                    text-purple-400
                    mb-6
                  "
                />
              )}

              {/* Title */}
              <h3
                className="
                  text-2xl
                  font-bold
                  text-white
                  mb-4
                "
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                className="
                  text-gray-400
                  leading-relaxed
                "
              >
                {item.desc || item.quote}
              </p>

            </MovingCard>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

interface MovingCardsContainerProps {
  items: any[];
  className?: string;
}

export function MovingCardsContainer({
  items,
  className = "",
}: MovingCardsContainerProps) {
  return (
    <div
      className={`
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
        ${className}
      `}
    >
      {items.map((item, index) => (
        <MovingCard key={index}>

          {item.icon && (
            <item.icon
              className="
                w-10
                h-10
                text-purple-400
                mb-6
              "
            />
          )}

          <h3 className="text-2xl font-bold text-white mb-4">
            {item.title}
          </h3>

          <p className="text-gray-400 leading-relaxed">
            {item.desc || item.quote}
          </p>

        </MovingCard>
      ))}
    </div>
  );
}