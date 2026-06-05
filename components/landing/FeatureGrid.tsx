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
    title: "Scheme Discovery",
    desc: "Find government schemes based on your profile and eligibility.",
    icon: Landmark,
  },
  {
    title: "Document Explainer",
    desc: "Upload notices, forms, and PDFs for simplified AI explanations.",
    icon: FileText,
  },
  {
    title: "Complaint Generator",
    desc: "Generate professional complaints and grievance drafts instantly.",
    icon: ShieldAlert,
  },
  {
    title: "Voice Assistant",
    desc: "Interact with JanMitra AI using natural voice conversations.",
    icon: Mic,
  },
  {
    title: "22+ Indian Languages",
    desc: "Designed for multilingual communication across India.",
    icon: Languages,
  },
  {
    title: "Citizen Accessibility",
    desc: "Built for rural users, senior citizens, and first-time digital users.",
    icon: Accessibility,
  },
];

export default function FeatureGrid() {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto">

      <h2 className="text-5xl font-bold text-center mb-20 text-white">
        One AI for Every Citizen
      </h2>

      <InfiniteMovingCards
        items={features}
        direction="left"
        speed="normal"
      />

    </section>
  );
}