"use client";

import Link from "next/link";
import {
  Mic,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="max-w-7xl mx-auto px-6 py-8">

        {/* HERO */}
       <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="max-w-5xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 relative overflow-hidden"
>
          <div className="absolute w-[280px] h-[280px] rounded-full bg-purple-500/20 blur-[90px] top-[-80px] right-[-80px]" />

          <div className="relative z-10">

        <h1 className="text-4xl md:text-5xl font-black leading-none tracking-tight">
  Your AI-Powered Government Assistant
</h1>
<p className="text-slate-300 text-base md:text-lg mt-2 max-w-4xl leading-relaxed">
  Discover schemes, understand documents, file complaints, and
  interact with government services in your own language.
</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <Link href="/voice">
               <button
  className="
  px-5 py-2.5
  rounded-full
  bg-gradient-to-r
  from-purple-500
  to-blue-600
  flex items-center gap-2
  font-medium
  transition-all duration-300
  hover:scale-105
  hover:-translate-y-1
  hover:shadow-[0_0_35px_rgba(139,92,246,0.45)]
  active:scale-95
"
>
                  Start Voice Assistant
                </button>
              </Link>

              <Link href="/schemes">
               <button
  className="
  px-5 py-2.5
  rounded-full
  border border-white/10
  bg-white/5
  font-medium
  transition-all duration-300
  hover:bg-white/10
  hover:border-white/20
  hover:-translate-y-1
"
>
                  Explore Schemes
                </button>
              </Link>
            </div>

          </div>
       </motion.div>

        {/* DASHBOARD GRID */}
        <div className="grid lg:grid-cols-3 gap-5 mt-6">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">

            <div className="flex items-center justify-between">
              <div>

                <p className="text-purple-300 uppercase tracking-[0.25em] text-xs">
                  Personalized Recommendations
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  Recommended For You
                </h2>

              </div>

              <Sparkles
                className="text-purple-400"
                size={32}
              />

            </div>

            <div className="grid md:grid-cols-2 gap-3 mt-5">

              {[
                {
                  title: "Ayushman Bharat",
                  desc: "Free healthcare coverage up to ₹5 lakh.",
                },
                {
                  title: "PM Kisan",
                  desc: "Income support for farmers.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-4
                    hover:bg-white/[0.05]
                    transition-all
                    flex
                    flex-col
                  "
                >
                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 mt-1 text-sm leading-relaxed">
                    {item.desc}
                  </p>

                  <button className="mt-3 w-fit px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-sm font-medium">
                    View Details
                  </button>
                </div>
              ))}

            </div>

          </div>

          {/* RIGHT SECTION */}
          <div className="flex flex-col gap-4">

            {/* Stats Card 1 */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-slate-400 text-sm">
                    Schemes Matched
                  </p>

                  <h2 className="text-4xl font-black mt-1">
                    24
                  </h2>
                </div>

                <ShieldCheck
                  size={38}
                  className="text-green-400"
                />

              </div>

            </div>

            {/* Stats Card 2 */}
            <div className="
rounded-3xl
border border-white/10
bg-white/[0.04]
backdrop-blur-xl
p-4
transition-all duration-300
hover:-translate-y-1
hover:border-white/20
hover:bg-white/[0.06]
hover:shadow-xl">


              <div className="flex items-center justify-between">

                <div>
                  <p className="text-slate-400 text-sm">
                    Documents Explained
                  </p>

                  <h2 className="text-4xl font-black mt-1">
                    12
                  </h2>
                </div>

                <FileText
                  size={38}
                  className="text-blue-400"
                />

              </div>

            </div>

            {/* Quick Actions */}
            <div className="
rounded-3xl
border border-white/10
bg-white/[0.04]
backdrop-blur-xl
p-4
transition-all duration-300
hover:border-purple-500/20
">

              <h3 className="text-lg font-bold">
                Quick Actions
              </h3>

              <div className="space-y-2 mt-3">

                <Link href="/voice">
                  <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    Voice Assistant
                  </button>
                </Link>

                <Link href="/schemes">
                  <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    Check Eligibility
                  </button>
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>
    </main>
  );
}
