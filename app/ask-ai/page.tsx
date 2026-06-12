"use client";

import { useState } from "react";
import axios from "axios";

type Tab = "home" | "schemes" | "complaints" | "documents" | "help";

// Complete Localized Dual-Language Mapping Matrices for Indian States
const indianStatesEn = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
];

const indianStatesHi = [
  "आंध्र प्रदेश", "अरुणाचल प्रदेश", "असम", "बिहार", "छत्तीसगढ़", "गोवा", "गुजरात", 
  "हरियाणा", "हिमाचल प्रदेश", "झारखंड", "कर्नाटक", "केरल", "मध्य प्रदेश", 
  "महाराष्ट्र", "मानिपुर", "मेघालय", "मिजोरम", "नागालैंड", "ओडिशा", "पंजाब", 
  "राजस्थान", "सिक्किम", "तमिलनाडु", "तेलंगाना", "त्रिपुरा", "उत्तर प्रदेश", 
  "उत्तराखंड", "पश्चिम बंगाल", "दिल्ली", "जम्मू और कश्मीर"
];

// Unified On-the-Fly Variable Dictionary Converter Matrix
const uiTranslationMap: Record<string, Record<string, string>> = {
  english: {
    student: "Student", farmer: "Farmer", worker: "Worker", business: "Business",
    general: "General", obc: "OBC", sc: "SC", st: "ST",
    male: "Male", female: "Female", selectState: "Select State",
    occupationPlaceholder: "Occupation", categoryPlaceholder: "Category", genderPlaceholder: "Gender",
    benefitsHeading: "Benefits", documentsHeading: "Required Documents",
    ayushmanTitle: "Ayushman Bharat PM-JAY", ayushmanDesc: "Provides free healthcare coverage up to ₹5 lakh per family annually.",
    pmAwasTitle: "PM Awas Yojana", pmAwasDesc: "Affordable housing assistance for low-income families.",
    scholarshipTitle: "National Scholarship Portal", scholarshipDesc: "Scholarship support for eligible students.",
    atalTitle: "Atal Pension Yojana", atalDesc: "Guaranteed pension scheme for citizens."
  },
  hindi: {
    student: "छात्र", farmer: "किसान", worker: "मजदूर", business: "व्यापार / व्यवसाय",
    general: "सामान्य (General)", obc: "ओबीसी (OBC)", sc: "अनुसूचित जाति (SC)", st: "अनुसूचित जनजाति (ST)",
    male: "पुरुष", female: "महिला", selectState: "राज्य का चयन करें",
    occupationPlaceholder: "व्यवसाय चुनें", categoryPlaceholder: "श्रेणी चुनें", genderPlaceholder: "लिंग चुनें",
    benefitsHeading: "योजना के लाभ", documentsHeading: "आवश्यक दस्तावेज",
    ayushmanTitle: "आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (PM-JAY)", ayushmanDesc: "प्रति परिवार प्रति वर्ष ₹5 lakh तक का मुफ्त स्वास्थ्य कवरेज प्रदान करता है।",
    pmAwasTitle: "प्रधानमंत्री आवास योजना (PMAY)", pmAwasDesc: "कम आय वाले परिवारों के लिए किफायती आवास सहायता।",
    scholarshipTitle: "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)", scholarshipDesc: "योग्य और मेधावी छात्रों के लिए वित्तीय शैक्षणिक सहायता।",
    atalTitle: "अटल पेंशन योजना (APY)", atalDesc: "असंगठित क्षेत्र के नागरिकों के लिए गारंटीकृत मासिक पेंशन योजना।"
  }
};

// Core visual style helpers shared across dashboard button components
const baseCta = "w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ease-out active:scale-[0.98]";
const purpleCta = "bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#8b5cf6] hover:to-[#7c3aed] shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)]";
const roseCta = "bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] shadow-[0_4px_15px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.4)]";
const tealCta = "bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#14b8a6] hover:to-[#0d9488] shadow-[0_4px_15px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.4)]";
const blueCta = "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)]";
const ghostBtn = "rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300 ease-out active:scale-[0.98] font-medium";

export default function AskAIPage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpLanguage, setHelpLanguage] = useState("english");

  const [schemeForm, setSchemeForm] = useState({
    age: "", income: "", occupation: "", category: "", gender: "", state: "",
    language: "english"
  });
  const [schemes, setSchemes] = useState<any[]>([]);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [selectedDetailedScheme, setSelectedDetailedScheme] = useState<any | null>(null);

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

  // Core global file and tracking states
  const [file, setFile] = useState<File | null>(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [docLanguage, setDocLanguage] = useState("english");
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Multi-lingual Text Transformer Engine Function
  const translateCardElement = (scheme: any) => {
    if (schemeForm.language !== "hindi") return scheme;
    const nameStr = scheme.name || "";
    
    if (nameStr.includes("Ayushman") || nameStr.includes("आयुष्मान")) {
      return { ...scheme, name: uiTranslationMap.hindi.ayushmanTitle, description: uiTranslationMap.hindi.ayushmanDesc };
    }
    if (nameStr.includes("Awas") || nameStr.includes("आवास")) {
      return { ...scheme, name: uiTranslationMap.hindi.pmAwasTitle, description: uiTranslationMap.hindi.pmAwasDesc };
    }
    if (nameStr.includes("Scholarship") || nameStr.includes("छात्रवृत्ति")) {
      return { ...scheme, name: uiTranslationMap.hindi.scholarshipTitle, description: uiTranslationMap.hindi.scholarshipDesc };
    }
    if (nameStr.includes("Atal") || nameStr.includes("अटल")) {
      return { ...scheme, name: uiTranslationMap.hindi.atalTitle, description: uiTranslationMap.hindi.atalDesc };
    }
    return scheme;
  };

  const askAI = async () => {
    try { 
      setLoading(true); 
      const res = await axios.post("/api/chat", { message, language: helpLanguage }); 
      setReply(res.data.reply); 
    }
    catch (error) { console.log(error); } finally { setLoading(false); }
  };

  const handleSchemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSchemeForm({ ...schemeForm, [e.target.name]: e.target.value });
  };

  const findSchemes = async () => {
    try {
      setSchemeLoading(true);
      setSelectedDetailedScheme(null);
      const res = await axios.post("/api/schemes", {
        age: Number(schemeForm.age), income: Number(schemeForm.income),
        occupation: schemeForm.occupation, category: schemeForm.category,
        gender: schemeForm.gender, state: schemeForm.state,
        language: schemeForm.language
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

  // Safe Dynamic File Handler Pipeline
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    try {
      if (!file) {
        alert(docLanguage === "hindi" ? "कृपया पहले एक फ़ाइल अपलोड करें!" : "Please upload a file first!");
        return;
      }
      setDocumentLoading(true);
      setAnalysisResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post("/api/document-upload", formData);

      const analyzeRes = await axios.post("/api/document-analyze", { 
        documentText: uploadRes.data.text, 
        language: docLanguage 
      });

      setAnalysisResult(analyzeRes.data);
    } catch (error) { 
      console.log(error); 
      alert(docLanguage === "hindi" ? "विश्लेषण विफल रहा" : "Analysis failed");
    } finally { 
      setDocumentLoading(false); 
    }
  };

  const cards = [
    { tab: "schemes" as Tab, icon: "🎯", accent: "purple", badge: "Most Popular", title: "Discover Eligible Schemes", description: "Find central & state government schemes tailored to your age, income, category, and occupation.", steps: ["Fill profile", "AI matches", "Apply"], cta: "Find My Schemes", iconBg: "bg-[rgba(139,92,246,0.15)] border-[rgba(139,92,246,0.25)]", badgeClass: "bg-[rgba(139,92,246,0.15)] text-[#a78bfa] border-[rgba(139,92,246,0.25)]", glow: "bg-[radial-gradient(ellipse_at_0%_0%,rgba(139,92,246,0.15)_0%,transparent_60%)]", hoverBorder: "hover:border-[rgba(139,92,246,0.4)]", btnClass: "bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#8b5cf6] hover:to-[#7c3aed] shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)]" },
    { tab: "complaints" as Tab, icon: "📝", accent: "rose", badge: null, title: "Draft & File Complaints", description: "Generate formal, department-specific complaints using AI. Available in English and Hindi.", steps: ["Describe issue", "AI drafts", "Submit"], cta: "Draft Complaint", iconBg: "bg-[rgba(244,63,94,0.15)] border-[rgba(244,63,94,0.25)]", badgeClass: "", glow: "bg-[radial-gradient(ellipse_at_0%_0%,rgba(244,63,94,0.15)_0%,transparent_60%)]", hoverBorder: "hover:border-[rgba(244,63,94,0.4)]", btnClass: "bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] shadow-[0_4px_15px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.4)]" },
    { tab: "documents" as Tab, icon: "📄", accent: "teal", badge: null, title: "Understand Documents", description: "Upload any government document — Aadhaar, ration card, notices — get a plain-language summary instantly.", steps: ["Upload file", "AI reads", "Plain summary"], cta: "Analyze Document", iconBg: "bg-[rgba(20,184,166,0.15)] border-[rgba(20,184,166,0.25)]", badgeClass: "", glow: "bg-[radial-gradient(ellipse_at_0%_0%,rgba(20,184,166,0.15)_0%,transparent_60%)]", hoverBorder: "hover:border-[rgba(20,184,166,0.4)]", btnClass: "bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#14b8a6] hover:to-[#0d9488] shadow-[0_4px_15px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.4)]" },
    { tab: "help" as Tab, icon: "💬", accent: "blue", badge: null, title: "Talk to JanMitra", description: "Ask anything — pensions, certificates, RTI, voter ID, ration card, or any civic grievance.", steps: ["Type question", "AI responds", "Take action"], cta: "Start Chatting", iconBg: "bg-[rgba(59,130,246,0.15)] border-[rgba(59,130,246,0.25)]", badgeClass: "", glow: "bg-[radial-gradient(ellipse_at_0%_0%,rgba(59,130,246,0.15)_0%,transparent_60%)]", hoverBorder: "hover:border-[rgba(59,130,246,0.4)]", btnClass: "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)]" }
  ];

  // FIXED: Declared precisely before the main render block to secure top-level compiler scope variables
  const langKey = schemeForm.language === "hindi" ? "hindi" : "english";
  const dict = uiTranslationMap[langKey];
  const statesArrayToRender = schemeForm.language === "hindi" ? indianStatesHi : indianStatesEn;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="relative rounded-3xl border border-[rgba(139,92,246,0.25)] bg-gradient-to-br from-[rgba(139,92,246,0.08)] to-[rgba(59,130,246,0.05)] p-8 sm:p-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(139,92,246,0.12)_0%,transparent_60%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.15)] px-3.5 py-1.5 text-xs font-medium text-[#a78bfa] tracking-wide mb-5">
              <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
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

        {/* HOME VIEW */}
        {activeTab === "home" && (
          <>
            <div className="mt-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold">How can I help you today?</h2>
              <p className="text-white/45 mt-3 text-sm">Choose a task · A guided form will open instantly</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-10">
              {cards.map((card) => (
                <div
                  key={card.tab} onClick={() => setActiveTab(card.tab)}
                  className={`group relative rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-7 cursor-pointer overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/[0.05] ${card.hoverBorder}`}
                >
                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${card.iconBg}`}>{card.icon}</div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 leading-snug">{card.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-5">{card.description}</p>
                    <button className={`${baseCta} ${card.btnClass} text-white`}>{card.cta} →</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* INNER PAGE CONSOLES */}
        {activeTab !== "home" && (
          <div className="mt-10">
            <button
              onClick={() => { setActiveTab("home"); setSelectedDetailedScheme(null); }}
              className={`mb-6 px-6 py-3 ${ghostBtn} flex items-center gap-2 text-sm`}
            >
              ← {schemeForm.language === "hindi" ? "मुख्य पृष्ठ" : "Back to Home"}
            </button>

            {/* SCHEMES PAGE PANELS */}
            {activeTab === "schemes" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {schemeForm.language === "hindi" ? "पात्र योजनाओं की खोज करें" : "Discover Eligible Schemes"}
                    </h2>
                    <select
                      name="language" value={schemeForm.language} onChange={handleSchemeChange}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none text-sm text-purple-300 font-semibold"
                    >
                      <option value="english">English Form</option>
                      <option value="hindi">हिंदी फॉर्म</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="number" 
                      name="age" 
                      placeholder={schemeForm.language === "hindi" ? "उम्र (Age)" : "Age"} 
                      value={schemeForm.age} 
                      onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] text-white"
                    />

                    <input
                      type="number" 
                      name="income" 
                      placeholder={schemeForm.language === "hindi" ? "वार्षिक आय (Annual Income)" : "Annual Income"} 
                      value={schemeForm.income} 
                      onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] text-white"
                    />
                    
                    <select
                      name="state" value={schemeForm.state} onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] text-white"
                    >
                      <option value="">{dict.selectState}</option>
                      {statesArrayToRender.map((stateLabel, index) => (
                        <option key={stateLabel} value={indianStatesEn[index]}>{stateLabel}</option>
                      ))}
                    </select>

                    <select
                      name="occupation" value={schemeForm.occupation} onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] text-white"
                    >
                      <option value="">{dict.occupationPlaceholder}</option>
                      <option value="student">{dict.student}</option>
                      <option value="farmer">{dict.farmer}</option>
                      <option value="worker">{dict.worker}</option>
                      <option value="business">{dict.business}</option>
                    </select>
                    <select
                      name="category" value={schemeForm.category} onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] text-white"
                    >
                      <option value="">{dict.categoryPlaceholder}</option>
                      <option value="general">{dict.general}</option>
                      <option value="obc">{dict.obc}</option>
                      <option value="sc">{dict.sc}</option>
                      <option value="st">{dict.st}</option>
                    </select>
                    <select
                      name="gender" value={schemeForm.gender} onChange={handleSchemeChange}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-[rgba(139,92,246,0.5)] text-white"
                    >
                      <option value="">{dict.genderPlaceholder}</option>
                      <option value="male">{dict.male}</option>
                      <option value="female">{dict.female}</option>
                    </select>
                    <button onClick={findSchemes} className={`${baseCta} ${purpleCta} text-white`}>
                      {schemeLoading ? (schemeForm.language === "hindi" ? "खोज की जा रही है..." : "Finding...") : (schemeForm.language === "hindi" ? "मेरी योजनाएं खोजें" : "Find My Schemes")}
                      <span className="inline-block">→</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                    {schemeForm.language === "hindi" ? "अनुशंसित योजनाएं" : "Recommended Schemes"}
                  </h2>
                  
                  {selectedDetailedScheme ? (
                    <div className="space-y-5">
                      <button onClick={() => setSelectedDetailedScheme(null)} className="text-xs text-purple-300 hover:underline">
                        ← {schemeForm.language === "hindi" ? "सूची पर वापस जाएं" : "Back to List"}
                      </button>
                      {(() => {
                        const cell = translateCardElement(selectedDetailedScheme);
                        return (
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase">{cell.category || "Welfare"}</span>
                            <h3 className="text-2xl font-bold mt-4">{cell.name}</h3>
                            <p className="text-white/60 text-sm mt-2 leading-relaxed">{cell.description}</p>
                            
                            <h4 className="text-sm font-bold text-purple-400 mt-5 mb-2 uppercase tracking-wide">{dict.benefitsHeading}</h4>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white/70">
                              {cell.benefits || "Direct structural assistance and institutional service access enablement."}
                            </div>

                            <h4 className="text-sm font-bold text-purple-400 mt-5 mb-2 uppercase tracking-wide">{dict.documentsHeading}</h4>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300">Identity Proof</span>
                              <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300">Income Certificate</span>
                              <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300">Domicile Status</span>
                            </div>

                            <a href="https://www.myscheme.gov.in" target="_blank" rel="noreferrer" className="block text-center mt-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 font-semibold text-sm">
                              {schemeForm.language === "hindi" ? "अभी आवेदन करें ↗️" : "Apply Now ↗️"}
                            </a>
                          </div>
                        );
                      })()}
                    </div>
                  ) : schemes.length === 0 ? (
                    <p className="text-white/45 text-sm">
                      {schemeForm.language === "hindi" ? "योजनाओं को खोजने के लिए अपनी प्रोफाइल पूरी करें।" : "Complete your profile to discover schemes."}
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                      {schemes.map((scheme, index) => {
                        const mappedRow = translateCardElement(scheme);
                        return (
                          <div
                            key={index} onClick={() => setSelectedDetailedScheme(scheme)}
                            className="block text-left w-full cursor-pointer rounded-2xl border border-white/[0.08] bg-white/[0.05] p-5 transition-all duration-300 ease-out hover:border-[rgba(139,92,246,0.4)] hover:bg-white/[0.07] hover:-translate-y-0.5"
                          >
                            <h3 className="text-lg font-semibold text-purple-200">{mappedRow.name}</h3>
                            <p className="text-white/50 text-sm mt-2 leading-relaxed">{mappedRow.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* AI Recommendation Box */}
                  {aiExplanation && (
                    <div className="rounded-2xl border border-[rgba(139,92,246,0.25)] bg-[rgba(139,92,246,0.08)] p-5 mt-6 animate-[fadeIn_0.3s_ease-out]">
                      <h3 className="font-semibold mb-3 text-sm text-purple-300">
                        {schemeForm.language === "hindi" ? "एआई अनुशंसा" : "AI Recommendation"}
                      </h3>
                      <p className="whitespace-pre-wrap text-white/60 text-sm leading-relaxed font-sans">{aiExplanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* COMPLAINTS */}
            {activeTab === "complaints" && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* LEFT SIDE PANEL: ASSISTANT CONSOLE */}
                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {language === "hindi" ? "शिकायत सहायक (AI Assistant)" : "Complaint Assistant"}
                    </h2>
                    
                    <select
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none text-sm text-rose-300 font-semibold"
                    >
                      <option value="english">English Interface</option>
                      <option value="hindi">हिंदी इंटरफेस</option>
                    </select>
                  </div>

                  <textarea
                    rows={6} 
                    value={issue} 
                    onChange={(e) => setIssue(e.target.value)} 
                    placeholder={language === "hindi" ? "अपनी समस्या का विस्तार से वर्णन करें..." : "Describe your civic issue in detail..."}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 outline-none focus:border-[rgba(244,63,94,0.5)] text-white resize-none"
                  />

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <select
                      value={issueType} 
                      onChange={(e) => setIssueType(e.target.value)}
                      className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 outline-none text-white"
                    >
                      <option value="">{language === "hindi" ? "समस्या का प्रकार चुनें" : "Select Issue Type"}</option>
                      <option value="Water Supply">{language === "hindi" ? "जल आपूर्ति (Water Supply)" : "Water Supply"}</option>
                      <option value="Electricity">{language === "hindi" ? "बिजली समस्या (Electricity)" : "Electricity"}</option>
                      <option value="Road Damage">{language === "hindi" ? "सड़क क्षति (Road Damage)" : "Road Damage"}</option>
                      <option value="Garbage">{language === "hindi" ? "कचरा प्रबंधन (Garbage)" : "Garbage"}</option>
                    </select>

                    <select
                      value={priority} 
                      onChange={(e) => setPriority(e.target.value)}
                      className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 outline-none text-white"
                    >
                      <option value="">{language === "hindi" ? "प्राथमिकता चुनें" : "Select Priority"}</option>
                      <option value="Low">{language === "hindi" ? "कम (Low)" : "Low"}</option>
                      <option value="Medium">{language === "hindi" ? "मध्यम (Medium)" : "Medium"}</option>
                      <option value="Urgent">{language === "hindi" ? "आपातकालीन (Urgent)" : "Urgent"}</option>
                    </select>
                  </div>

                  <button onClick={askQuestions} className={`w-full mt-6 py-4 ${ghostBtn} text-rose-300 font-semibold`}>
                    ✨ {language === "hindi" ? "एआई से पूरक प्रश्न पूछें" : "AI Ask Follow-up Questions"}
                  </button>

                  {questions.length > 0 && (
                    <div className="mt-8 space-y-4 animate-[fadeIn_0.3s_ease-out]">
                      <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wide">
                        {language === "hindi" ? "कृपया बेहतर ड्राफ्ट के लिए इन सवालों का जवाब दें:" : "Please answer these to refine the draft:"}
                      </h3>
                      {questions.map((question, index) => (
                        <div key={index} className="space-y-2">
                          <label className="block text-white/70 text-sm">{question}</label>
                          <input
                            type="text"
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white outline-none focus:border-[rgba(244,63,94,0.4)]"
                            onChange={(e) => setAnswers({ ...answers, [question]: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button onClick={generateComplaint} className={`${baseCta} ${roseCta} text-white mt-8`}>
                    {complaintLoading ? (language === "hindi" ? "शिकायत बनाई जा रही है..." : "Generating...") : (language === "hindi" ? "औपचारिक शिकायत पत्र जनरेट करें" : "Generate Complaint")}
                    <span className="inline-block">→</span>
                  </button>
                </div>

                {/* RIGHT SIDE PANEL: AI OUTPUT DISPLAY */}
                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    {language === "hindi" ? "एआई जनरेटेड शिकायत" : "AI Generated Complaint"}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5">
                      <h3 className="font-semibold mb-2 text-sm text-rose-300">
                        {language === "hindi" ? "संबंधित सरकारी विभाग (Target Department)" : "Target Government Department"}
                      </h3>
                      <p className="text-white/80 font-medium text-sm">{department || (language === "hindi" ? "विभाग का नाम यहाँ दिखाई देगा" : "Department will appear here")}</p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5">
                      <h3 className="font-semibold mb-3 text-sm text-rose-300">
                        {language === "hindi" ? "आधिकारिक पत्र प्रारूप (Official Legal Letter in English)" : "Official Complaint Letter Draft"}
                      </h3>
                      <pre className="whitespace-pre-wrap text-white/70 text-sm leading-relaxed font-sans max-h-[350px] overflow-y-auto custom-scrollbar">
                        {complaint || (language === "hindi" ? "शिकायत का आधिकारिक प्रारूप यहाँ जनरेट होगा..." : "Complaint draft letter will appear here...")}
                      </pre>
                    </div>

                    {complaint && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(complaint);
                          alert(language === "hindi" ? "शिकायत पत्र सफलतापूर्वक क्लिपबोर्ड में कॉपी हो गया!" : "Complaint letter copied to clipboard successfully!");
                        }}
                        className={`${baseCta} bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg`}
                      >
                        📋 {language === "hindi" ? "शिकायत पत्र कॉपी करें" : "Copy Complaint Letter"}
                      </button>
                    )}

                    <a
                      href="https://pgportal.gov.in" 
                      target="_blank" 
                      rel="noreferrer"
                      className={`block text-center py-4 ${ghostBtn} text-white/80 hover:text-white transition-colors`}
                    >
                      {language === "hindi" ? "सीधे पीजी पोर्टल (PG Portal) पर सबमिट करें ↗" : "Submit on PG Portal ↗"}
                    </a>

                    <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5">
                      <h3 className="font-semibold mb-3 text-sm text-rose-300">
                        {language === "hindi" ? "महत्वपूर्ण निर्देश एवं अगले कदम" : "Actionable AI Steps & Recommendations"}
                      </h3>
                      <div className="text-sm text-white/70 space-y-2 leading-relaxed">
                        {recommendations.length > 0 ? (
                          recommendations.map((item, index) => (
                            <p key={index} className="block"><span className="text-rose-400 font-bold">{index + 1}.</span> {item}</p>
                          ))
                        ) : (
                          <p className="text-white/40">{language === "hindi" ? "निर्देश यहाँ दिखाई देंगे।" : "Recommendations will appear here."}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            

                        {/* DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* LEFT CONSOLE */}
                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {docLanguage === "hindi" ? "दस्तावेज़ विश्लेषक" : "Document Explainer"}
                    </h2>
                    <select
                      name="docLanguage" 
                      value={docLanguage} 
                      onChange={(e) => setDocLanguage(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none text-sm text-emerald-300 font-semibold"
                    >
                      <option value="english">English Summary</option>
                      <option value="hindi">हिंदी सारांश</option>
                    </select>
                  </div>

                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/[0.01] hover:bg-white/[0.03] transition-colors group cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".txt,.pdf,.docx,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <div className="text-4xl mb-4 text-emerald-400/70 group-hover:text-emerald-400 transition-colors">📄</div>
                    <p className="text-white/80 font-medium text-sm mb-1">
                      {file ? `Selected: ${file.name}` : (docLanguage === "hindi" ? "अपनी .pdf, .txt, .png, या .jpg फ़ाइल यहाँ अपलोड करें" : "Drag & drop your government file here")}
                    </p>
                    <p className="text-white/40 text-xs">
                      Supported Formats: PDF, PNG, JPG, TXT, DOCX
                    </p>
                  </div>

                  <button 
                    onClick={handleAnalyze}
                    disabled={documentLoading}
                    className={`${baseCta} bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white mt-8 disabled:opacity-50`}
                  >
                    {documentLoading 
                      ? (docLanguage === "hindi" ? "विश्लेषण जारी है..." : "Analyzing...") 
                      : (docLanguage === "hindi" ? "दस्तावेज़ का विश्लेषण करें →" : "Analyze Document →")}
                  </button>
                </div>

                {/* RIGHT CONSOLE - RESULTS */}
                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    {docLanguage === "hindi" ? "एआई सारांश" : "AI Summary"}
                  </h2>

                  <div className="space-y-5 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">

                    {/* Empty state */}
                    {!analysisResult && !documentLoading && (
                      <p className="text-white/45 text-sm">
                        {docLanguage === "hindi" 
                          ? "विवरण देखने के लिए फ़ाइल अपलोड करें।" 
                          : "Upload a file to see the analysis."}
                      </p>
                    )}

                    {/* Loading state */}
                    {documentLoading && (
                      <div className="text-sm text-white/50 animate-pulse text-center py-10">
                        {docLanguage === "hindi" 
                          ? "सरकारी दस्तावेज़ का विश्लेषण किया जा रहा है..." 
                          : "Analyzing document structures..."}
                      </div>
                    )}

                    {/* Results */}
                    {analysisResult && (
                      <>
                        {/* Purpose / उद्देश्य */}
                        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                            {docLanguage === "hindi" ? "उद्देश्य" : "Purpose"}
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {analysisResult["उद्देश्य"] || analysisResult.purpose || "—"}
                          </p>
                        </div>

                        {/* Dates / महत्वपूर्ण तिथियां */}
                        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                            {docLanguage === "hindi" ? "महत्वपूर्ण तिथियां" : "Important Dates"}
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {analysisResult["महत्वपूर्ण तिथियां"] || analysisResult.dates || "—"}
                          </p>
                        </div>

                        {/* Required Docs / आवश्यक दस्तावेज */}
                        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                            {docLanguage === "hindi" ? "आवश्यक दस्तावेज" : "Required Documents"}
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {analysisResult["आवश्यक दस्तावेज"] || analysisResult.requiredDocs || "—"}
                          </p>
                        </div>

                        {/* Actions / आवश्यक कार्रवाई */}
                        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                            {docLanguage === "hindi" ? "आवश्यक कार्रवाई" : "Actions Needed"}
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {analysisResult["आवश्यक कार्रवाई"] || analysisResult.actions || "—"}
                          </p>
                        </div>

                        {/* Summary / सरल सारांश */}
                        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                            {docLanguage === "hindi" ? "सरल सारांश" : "Simple Summary"}
                          </h3>
                          <p className="text-white/90 text-sm font-medium leading-relaxed">
                            {analysisResult["सरल सारांश"] || analysisResult.summary || "—"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}


            {/* HELP / MULTI-LINGUAL CHAT DISPLAY */}
            {activeTab === "help" && (
              <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h2 className="text-2xl font-bold">Chat with JanMitra</h2>
                  <select value={helpLanguage} onChange={(e) => setHelpLanguage(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-blue-400 font-semibold outline-none text-sm">
                    <option value="english">English Bot</option>
                    <option value="hindi">हिंदी बॉट</option>
                  </select>
                </div>
                <div className="space-y-4 mb-6 min-h-[250px] max-h-[400px] overflow-y-auto border border-white/5 bg-white/[0.02] p-5 rounded-2xl custom-scrollbar">
                  {reply ? (
                    <div className="space-y-4">
                      <div className="text-sm bg-white/5 border border-white/10 p-4 rounded-xl max-w-[85%] ml-auto text-white/90">{message}</div>
                      <div className="text-sm bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl max-w-[85%] text-blue-200 whitespace-pre-wrap">{reply}</div>
                    </div>
                  ) : (
                    <p className="text-white/30 text-sm">Ask about any civic grievance or government services...</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your query..." className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500" />
                  <button onClick={askAI} className={`px-8 ${blueCta} text-white font-bold h-full`}>{loading ? "Thinking..." : "Send"}</button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
