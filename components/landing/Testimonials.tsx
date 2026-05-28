"use client";

import { InfiniteMovingCards } from "@/components/ui/moving-cards";

const testimonials = [
  {
    title: "Sunita D.",
    desc: "I found 3 schemes I never knew existed.",
  },
  {
    title: "Ramesh K.",
    desc: "Elderly mode solved my pension confusion.",
  },
  {
    title: "Arjun P.",
    desc: "Complaint drafting became super easy.",
  },
  {
    title: "Priya M.",
    desc: "The voice assistant understands Hindi perfectly.",
  },
  {
    title: "Vikram S.",
    desc: "Document explanations are crystal clear.",
  },
  {
    title: "Neha T.",
    desc: "Finally, a government app that actually works!",
  },
];

export default function Testimonials() {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto">

      <h2 className="text-5xl font-bold text-center mb-20 text-white">
        Loved by citizens
      </h2>

      <InfiniteMovingCards
        items={testimonials}
        className="w-full"
        direction="right"
        speed="normal"
      />

    </section>
  );
}