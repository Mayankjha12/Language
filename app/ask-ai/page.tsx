"use client";

import { useState } from "react";
import axios from "axios";

type Tab = "home" | "schemes" | "complaints" | "documents" | "help";

export default function AskAIPage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const [schemeForm, setSchemeForm] = useState({
    age: "", income: "", occupation: "", category: "", gender: "", state: "",
  });
  const [schemes, setSchemes] = useState<any[]>([]);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");

  const [issue, setIssue] = useState("");
  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [complaint, setComplaint] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState("english");
  const [complaintLoading, setComplaintLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [documentLoading, setDocumentLoading] = useState(false);

  const askAI = async () => {
    try { setLoading(true); const res = await axios.post("/api/chat", { message }); setReply(res.data.reply); }
    catch (error) { console.log(error); } finally { setLoading(false); }
  };

  const handleSchemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSchemeForm({ ...schemeForm, [e.target.name]: e.target.value });
  };

  const findSchemes = async () => {
    try {
      setSchemeLoading(true);
      const res = await axios.post("/api/schemes", {
        age: Number(schemeForm.age), income: Number(schemeForm.income),
        occupation: schemeForm.occupation, category: schemeForm.category,
        gender: schemeForm.gender, state: schemeForm.state,
      });
      setSchemes(res.data.schemes || []);
      setAiExplanation(res.data.aiExplanation || "");
    } catch (error) { console.log(error); } finally { setSchemeLoading(false); }
  };

  const askQuestions = async () => {
    try {
      const res = await axios.post("/api/complaints/questions", { issue, issueType, language });
      setQuestions(res.data.questions || []);
    } catch (error) { console.log(error); }
  };

  const generateComplaint = async () => {
    try {
      setComplaintLoading(true);
      const res = await axios.post("/api/complaints", { issue, issueType, priority, answers, language });
      setDepartment(res.data.department);
      setComplaint(res.data.complaint);
      setRecommendations(res.data.recommendations || []);
    } catch (error) { console.log(error); } finally { setComplaintLoading(false); }
  };

  const handleAnalyze = async () => {
    try {
      if (!file) return;
      setDocumentLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post("/api/document-upload", formData);
      const analyzeRes = await axios.post("/api/document-analyze", { documentText: uploadRes.data.text });
      setSummary(analyzeRes.data.summary);
    } catch (error) { console.log(error); } finally { setDocumentLoading(false); }
  };

  const cards = [
    {
      tab: "schemes" as Tab,
      icon: "🎯",
      accent: "purple",
      badge: "Most Popular",
      title: "Discover Eligible Schemes",
      description: "Find central & state government schemes tailored to your age, income, category, and occupation.",
      steps: ["Fill profile", "AI matches", "Apply"],
      cta: "Find My Schemes",
      iconBg: "bg-[rgba(139,92,246,0.15)] border-[rgba(139,92,246,0.25)]",
      badgeClass: "bg-[rgba(139,92,246,0.15)] text-[#a78bfa] border-[rgba(139,92,246,0.25)]",
      glow: "bg-[radial-gradient(ellipse_at_0%_0%,rgba(139,92,246,0.15)_0%,transparent_60%)]",
      hoverBorder: "hover:border-[rgba(139,92,246,0.4)]",
      btnClass:
        "bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#8b5cf6] hover:to-[#7c3aed] shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)]",
    },
    {
      tab: "complaints" as Tab,
      icon: "📝",
      accent: "rose",
      badge: null,
      title: "Draft & File Complaints",
      description: "Generate formal, department-specific complaints using AI. Available in English and Hindi.",
      steps: ["Describe issue", "AI drafts", "Submit"],
      cta: "Draft Complaint",
      iconBg: "bg-[rgba(244,63,94,0.15)] border-[rgba(244,63,94,0.25)]",
      badgeClass: "",
      glow: "bg-[radial-gradient(ellipse_at_0%_0%,rgba(244,63,94,0.15)_0%,transparent_60%)]",
      hoverBorder: "hover:border-[rgba(244,63,94,0.4)]",
      btnClass:
        "bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] shadow-[0_4px_15px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.4)]",
    },
    {
      tab: "documents" as Tab,
      icon: "📄",
      accent: "teal",
      badge: null,
      title: "Understand Documents",
      description: "Upload any government document — Aadhaar, ration card, notices — get a plain-language summary instantly.",
      steps: ["Upload file", "AI reads", "Plain summary"],
      cta: "Analyze Document",
      iconBg: "bg-[rgba(20,184,166,0.15)] border-[rgba(20,184,166,0.25)]",
      badgeClass: "",
      glow: "bg-[radial-gradient(ellipse_at_0%_0%,rgba(20,184,166,0.15)_0%,transparent_60%)]",
      hoverBorder: "hover:border-[rgba(20,184,166,0.4)]",
      btnClass:
        "bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#14b8a6] hover:to-[#0d9488] shadow-[0_4px_15px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.4)]",
    },
    {
      tab: "help" as Tab,
      icon: "💬",
      accent: "blue",
      badge: null,
      title: "Talk to JanMitra",
      description: "Ask anything — pensions, certificates, RTI, voter ID, ration card, or any civic grievance.",
      steps: ["Type question", "AI responds", "Take action"],
      cta: "Start Chatting",
      iconBg: "bg-[rgba(59,130,246,0.15)] border-[rgba(59,130,246,0.25)]",
      badgeClass: "",
      glow: "bg-[radial-gradient(ellipse_at_0%_0%,rgba(59,130,246,0.15)_0%,transparent_60%)]",
      hoverBorder: "hover:border-[rgba(59,130,246,0.4)]",
      btnClass:
        "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)]",
    },
  ];

  // Shared button styling helpers — keep CTA buttons consistent across every tab,
  // with smooth gradient transitions and a gentle press effect.
  const baseCta =
    "w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ease-out active:scale-[0.98]";
  const purpleCta =
    "bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#8b5cf6] hover:to-[#7c3aed] shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)]";
  const roseCta =
    "bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] shadow-[0_4px_15px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.4)]";
  const tealCta =
    "bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#14b8a6] hover:to-[#0d9488] shadow-[0_4px_15px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.4)]";
  const blueCta =
    "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)]";
  const ghostBtn =
    "rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300 ease-out active:scale-[0.98] font-medium";

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <style jsx global>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes shimmerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .pulse-dot {
          animation: pulseDot 2s infinite;
        }
        .shimmer-layer {
          transform: translateX(-100%);
          transition: none;
        }
        .group:hover .shimmer-layer {
          animation: shimmerSweep 0.6s ease;
        }
      `}</style>

      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="relative rounded-3xl border border-[rgba(139,92,246,0.25)] bg-gradient-to-br from-[rgba(139,92,246,0.08)] to-[rgba(59,130,246,0.05)] p-8 sm:p-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(139,92,246,0.12)_0%,transparent_60%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.15)] px-3.5 py-1.5 text-xs font-medium text-[#a78bfa] tracking-wide mb-5">
              <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-[#a78bfa] shadow-[0_0_6px_#a78bfa]" />
              AI-Powered Governance Assistant
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-white to-[#a78bfa] bg-clip-text text-transparent leading-tight">
              Ask JanMitra AI
            </h1>
            <p className="text-white/50 mt-4 text-base sm:text-lg max-w-xl leading-relaxed">
              One intelligent assistant for schemes, complaints, documents and governance support — powered by AI.
            </p>
          </div>
        </div>

        {/* HOME */}
        {activeTab === "home" && (
          <>
            <div className="mt-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold">How can I help you today?</h2>
              <p className="text-white/45 mt-3 text-sm">
                Choose a task · A guided form will open instantly
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-10">
              {cards.map((card) => (
                <div
                  key={card.tab}
                  onClick={() => setActiveTab(card.tab)}
                  className={`
                    group relative rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-7
                    cursor-pointer overflow-hidden
                    transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/[0.05]
                    ${card.hoverBorder}
                  `}
                >
                  {/* Glow on hover */}
                  <div className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${card.glow}`} />

                  {/* Shimmer sweep */}
                  <div className="shimmer-layer pointer-events-none absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

                  <div className="relative">
                    {/* Top row: icon + badge */}
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${card.iconBg}`}>
                        {card.icon}
                      </div>
                      {card.badge && (
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border tracking-wide ${card.badgeClass}`}>
                          {card.badge}
                        </span>
                      )}
                    </div>

                    {/* Title + description */}
                    <h3 className="text-lg font-semibold mb-2 leading-snug">{card.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-5">{card.description}</p>

                    {/* Steps */}
                    <div className="flex items-center gap-1.5 mb-5 flex-wrap">
                      {card.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-white/[0.08] border border-white/[0.12] text-[10px] font-semibold flex items-center justify-center text-white/50">
                              {i + 1}
                            </span>
                            <span className="text-[11px] font-medium text-white/40 whitespace-nowrap">{step}</span>
                          </div>
                          {i < card.steps.length - 1 && <span className="text-[11px] text-white/20">›</span>}
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.06] mb-5" />

                    {/* CTA */}
                    <button className={`${baseCta} ${card.btnClass} text-white`}>
                      {card.cta}
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* INNER PAGES */}
        {activeTab !== "home" && (
          <div className="mt-10">
            <button
              onClick={() => setActiveTab("home")}
              className={`mb-6 px-6 py-3 ${ghostBtn} flex items-center gap-2 text-sm`}
            >
              ← Back to Home
            </button>

            {/* SCHEMES */}
            {activeTab === "schemes" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-8">Discover Eligible Schemes</h2>
                  <div className="space-y-4">
                    <input
                      type="number" name="age" placeholder="Age" value={schemeForm.age} onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors duration-300"
                    />
                    <input
                      type="number" name="income" placeholder="Annual Income" value={schemeForm.income} onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors duration-300"
                    />
                    <input
                      type="text" name="state" placeholder="State" value={schemeForm.state} onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors duration-300"
                    />
                    <select
                      name="occupation" value={schemeForm.occupation} onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors duration-300"
                    >
                      <option value="">Occupation</option>
                      <option value="student">Student</option>
                      <option value="farmer">Farmer</option>
                      <option value="worker">Worker</option>
                      <option value="business">Business</option>
                    </select>
                    <select
                      name="category" value={schemeForm.category} onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors duration-300"
                    >
                      <option value="">Category</option>
                      <option value="general">General</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                    </select>
                    <select
                      name="gender" value={schemeForm.gender} onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors duration-300"
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <button onClick={findSchemes} className={`${baseCta} ${purpleCta} text-white`}>
                      {schemeLoading ? "Finding..." : "Find My Schemes"}
                      <span className="inline-block">→</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-8">Recommended Schemes</h2>
                  {schemes.length === 0 ? (
                    <p className="text-white/45 text-sm">Complete your profile to discover schemes.</p>
                  ) : (
                    <div className="space-y-4">
                      {schemes.map((scheme, index) => (
                        <a
                          key={index} href={`/schemes/${scheme.id}`}
                          className="block rounded-2xl border border-white/[0.08] bg-white/[0.05] p-5 transition-all duration-300 ease-out hover:border-[rgba(139,92,246,0.4)] hover:bg-white/[0.07] hover:-translate-y-0.5"
                        >
                          <h3 className="text-lg font-semibold">{scheme.name}</h3>
                          <p className="text-white/50 text-sm mt-2 leading-relaxed">{scheme.description}</p>
                        </a>
                      ))}
                      {aiExplanation && (
                        <div className="rounded-2xl border border-[rgba(139,92,246,0.25)] bg-[rgba(139,92,246,0.08)] p-5">
                          <h3 className="font-semibold mb-3 text-sm">AI Recommendation</h3>
                          <p className="whitespace-pre-wrap text-white/60 text-sm leading-relaxed">{aiExplanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* COMPLAINTS */}
            {activeTab === "complaints" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">Complaint Assistant</h2>
                  <textarea
                    rows={8} value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Describe your issue..."
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 outline-none focus:border-[rgba(244,63,94,0.5)] transition-colors duration-300 resize-none"
                  />
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <select
                      value={issueType} onChange={(e) => setIssueType(e.target.value)}
                      className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 outline-none focus:border-[rgba(244,63,94,0.5)] transition-colors duration-300"
                    >
                      <option value="">Issue Type</option>
                      <option value="Water Supply">Water Supply</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Road Damage">Road Damage</option>
                      <option value="Garbage">Garbage</option>
                    </select>
                    <select
                      value={language} onChange={(e) => setLanguage(e.target.value)}
                      className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 outline-none focus:border-[rgba(244,63,94,0.5)] transition-colors duration-300"
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                    </select>
                    <select
                      value={priority} onChange={(e) => setPriority(e.target.value)}
                      className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 outline-none focus:border-[rgba(244,63,94,0.5)] transition-colors duration-300"
                    >
                      <option value="">Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <button onClick={askQuestions} className={`w-full mt-6 py-4 ${ghostBtn}`}>
                    ✨ AI Ask Questions
                  </button>
                  {questions.length > 0 && (
                    <div className="mt-8 space-y-4">
                      {questions.map((question, index) => (
                        <div key={index}>
                          <label className="block mb-2 text-white/60 text-sm">{question}</label>
                          <input
                            type="text"
                            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 outline-none focus:border-[rgba(244,63,94,0.5)] transition-colors duration-300"
                            onChange={(e) => setAnswers({ ...answers, [question]: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={generateComplaint} className={`${baseCta} ${roseCta} text-white mt-8`}>
                    {complaintLoading ? "Generating..." : "Generate Complaint"}
                    <span className="inline-block">→</span>
                  </button>
                </div>

                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">AI Generated Complaint</h2>
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5">
                      <h3 className="font-semibold mb-3 text-sm">Department</h3>
                      <p className="text-white/60 text-sm">{department || "Department will appear here"}</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5">
                      <h3 className="font-semibold mb-3 text-sm">Complaint Draft</h3>
                      <pre className="whitespace-pre-wrap text-white/60 text-sm leading-relaxed font-sans">{complaint || "Complaint draft will appear here"}</pre>
                    </div>
                    {complaint && (
                      <button
                        onClick={() => navigator.clipboard.writeText(complaint)}
                        className={`${baseCta} ${roseCta} text-white`}
                      >
                         Copy Complaint
                      </button>
                    )}
                    <a
                      href="https://pgportal.gov.in" target="_blank" rel="noreferrer"
                      className={`block text-center py-4 ${ghostBtn}`}
                    >
                      Submit on PG Portal ↗
                    </a>
                    <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5">
                      <h3 className="font-semibold mb-3 text-sm">AI Recommendations</h3>
                      <ul className="space-y-2 text-sm text-white/60">
                        {recommendations.length > 0 ? (
                          recommendations.map((item, index) => <li key={index}>• {item}</li>)
                        ) : (
                          <li className="text-white/40">Recommendations will appear here.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENTS */}
            {activeTab === "documents" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">Document Explainer</h2>
                  <div className="border-2 border-dashed border-[rgba(20,184,166,0.3)] hover:border-[rgba(20,184,166,0.6)] rounded-[20px] min-h-[350px] flex flex-col items-center justify-center transition-colors duration-300 bg-[rgba(20,184,166,0.05)]">
                    <div className="text-5xl mb-6">📄</div>
                    <input
                      type="file" accept=".docx,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="text-sm text-white/50"
                    />
                    {file && <p className="mt-4 text-[#5eead4] text-sm font-medium">📎 {file.name}</p>}
                    <button onClick={handleAnalyze} className={`mt-8 px-8 ${baseCta} ${tealCta} text-white w-auto`}>
                      {documentLoading ? "Analyzing..." : "Analyze Document"}
                      <span className="inline-block">→</span>
                    </button>
                  </div>
                </div>
                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">AI Summary</h2>
                  <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-6 min-h-[350px]">
                    {documentLoading ? (
                      <p className="text-white/45 text-sm">Analyzing document...</p>
                    ) : (
                      <pre className="whitespace-pre-wrap text-white/60 text-sm leading-relaxed font-sans">{summary || "Upload a document to generate summary."}</pre>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* HELP */}
            {activeTab === "help" && (
              <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">Government Help Assistant</h2>
                <textarea
                  rows={7} value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything about schemes, certificates, pensions, documents, government services..."
                  className="w-full rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5 outline-none focus:border-[rgba(59,130,246,0.5)] transition-colors duration-300 resize-none"
                />
                <button onClick={askAI} className={`mt-6 px-8 ${baseCta} ${blueCta} text-white w-auto`}>
                  {loading ? "Thinking..." : "Ask JanMitra"}
                  <span className="inline-block">→</span>
                </button>
                <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.05] p-6 min-h-[250px]">
                  <pre className="whitespace-pre-wrap text-white/60 text-sm leading-relaxed font-sans">{reply || "AI response will appear here."}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}