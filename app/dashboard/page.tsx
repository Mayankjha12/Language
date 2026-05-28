"use client";

import Link from "next/link";
import {
  Mic,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MovingCard, MovingCardsContainer } from "@/components/ui/moving-cards";

export default function DashboardPage() {

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* HERO */}
        <div className="rounded-[40px] border border-white/10 bg-white/5 p-10 relative overflow-hidden">

          <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[150px] top-[-100px] right-[-100px]" />

          <div className="relative z-10">

            <p className="uppercase tracking-[0.3em] text-purple-300 text-sm mb-5">
              JanMitra AI
            </p>

            <h1 className="text-6xl font-bold leading-tight max-w-4xl">
              Your AI-powered
              <br />
              Government Assistant
            </h1>

            <p className="text-gray-400 text-xl mt-6 max-w-2xl leading-relaxed">
              Discover schemes, understand documents,
              file complaints and interact with government
              services in your own language.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link href="/voice">

                <button className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition-all flex items-center gap-3">

                  <Mic />

                  Start Voice Assistant

                </button>

              </Link>

              <Link href="/schemes">

                <button className="px-8 py-4 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 transition-all">

                  Explore Schemes

                </button>

              </Link>

            </div>

          </div>

        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-8 mt-10">

          {/* LEFT LARGE */}
          <MovingCard className="lg:col-span-2">
            <div className="flex items-center justify-between">

              <div>

                <p className="text-purple-300 uppercase tracking-[0.2em] text-sm">
                  AI Insights
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  Recommended For You
                </h2>

              </div>

              <Sparkles className="text-purple-400" size={40} />

            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-10">

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

                <MovingCard key={index}>

                  <h3 className="text-2xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 mt-3">
                    {item.desc}
                  </p>

                  <button className="mt-6 px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">

                    View Details

                  </button>

                </MovingCard>

              ))}

            </div>

          </MovingCard>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6">

            {/* Card 1 */}
            <MovingCard>
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-400">
                    Schemes Matched
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    24
                  </h2>

                </div>

                <ShieldCheck
                  size={45}
                  className="text-green-400"
                />

              </div>

            </MovingCard>

            {/* Card 2 */}
            <MovingCard>
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-400">
                    Documents Explained
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    12
                  </h2>

                </div>

                <FileText
                  size={45}
                  className="text-blue-400"
                />

              </div>

            </MovingCard>

            {/* Card 3 */}
            <MovingCard>
              <h3 className="text-2xl font-semibold">
                Quick Actions
              </h3>

              <div className="space-y-4 mt-6">

                <Link href="/voice">

                  <button className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all">

                    Voice Assistant

                  </button>

                </Link>

                <Link href="/schemes">

                  <button className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all">

                    Check Eligibility

                  </button>

                </Link>

              </div>

            </MovingCard>

          </div>

        </div>

      </section>

    </main>
  );
}