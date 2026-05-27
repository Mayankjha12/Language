import {
    Mic,
    FileText,
    ShieldAlert,
    Landmark,
    Languages,
    Accessibility,
  } from "lucide-react";
  
  const features = [
    {
      title: "Scheme eligibility",
      desc: "Find every government scheme you qualify for.",
      icon: Landmark,
    },
    {
      title: "Document explainer",
      desc: "Upload documents and get AI summaries.",
      icon: FileText,
    },
    {
      title: "Complaint assistant",
      desc: "Draft complaints with AI assistance.",
      icon: ShieldAlert,
    },
    {
      title: "Voice AI assistant",
      desc: "Talk naturally in your own language.",
      icon: Mic,
    },
    {
      title: "8 Indian languages",
      desc: "Hindi, Tamil, Bengali, Telugu and more.",
      icon: Languages,
    },
    {
      title: "Elderly mode",
      desc: "Accessible UI for senior citizens.",
      icon: Accessibility,
    },
  ];
  
  export default function FeatureGrid() {
    return (
      <section className="px-6 py-24 max-w-7xl mx-auto">
  
        <h2 className="text-5xl font-bold text-center mb-20">
          One AI for every citizen need
        </h2>
  
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-purple-500/50 transition-all"
            >
  
              <feature.icon className="w-10 h-10 text-purple-400 mb-6" />
  
              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>
  
              <p className="text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
  
            </div>
          ))}
  
        </div>
      </section>
    );
  }