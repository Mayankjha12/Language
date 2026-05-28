"use client";

import {
  Mic,
  FileText,
  ShieldAlert,
  Landmark,
  Languages,
  Accessibility,
} from "lucide-react";

import { InfiniteMovingCards } from "@/components/ui/moving-cards";

const features = [
  {
    title: "Scheme Eligibility",
    desc: "Find every government scheme you qualify for instantly.",
    icon: Landmark,
  },
  {
    title: "Document Explainer",
    desc: "Upload documents and get simplified AI summaries.",
    icon: FileText,
  },
  {
    title: "Complaint Assistant",
    desc: "Draft professional complaints with AI assistance.",
    icon: ShieldAlert,
  },
  {
    title: "Voice AI Assistant",
    desc: "Talk naturally with AI in your own language.",
    icon: Mic,
  },
  {
    title: "8 Indian Languages",
    desc: "Supports Hindi, Tamil, Bengali, Telugu and more.",
    icon: Languages,
  },
  {
    title: "Elderly Mode",
    desc: "Accessible experience designed for senior citizens.",
    icon: Accessibility,
  },
];

export default function FeatureGrid() {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto">

      <h2 className="text-5xl font-bold text-center mb-20 text-white">
        One AI for every citizen need
      </h2>

      <InfiniteMovingCards
        items={features}
        direction="left"
        speed="normal"
      />

    </section>
  );
}