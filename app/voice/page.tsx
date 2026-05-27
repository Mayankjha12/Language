"use client";

import Navbar from "@/components/shared/Navbar";
import {
  Mic,
  Languages,
  Volume2,
  Square,
  ChevronDown,
} from "lucide-react";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import axios from "axios";

const languages = [

    { label: "English", value: "en-US" },
    { label: "हिन्दी", value: "hi-IN" },
    { label: "मैथिली", value: "mai-IN" },
    { label: "भोजपुरी", value: "bho-IN" },
    { label: "தமிழ்", value: "ta-IN" },
    { label: "తెలుగు", value: "te-IN" },
    { label: "বাংলা", value: "bn-IN" },
    { label: "मराठी", value: "mr-IN" },
    { label: "ગુજરાતી", value: "gu-IN" },
    { label: "ਪੰਜਾਬੀ", value: "pa-IN" },
    { label: "ಕನ್ನಡ", value: "kn-IN" },
    { label: "മലയാളം", value: "ml-IN" },
    { label: "ଓଡ଼ିଆ", value: "or-IN" },
    { label: "اردو", value: "ur-IN" },
    { label: "অসমীয়া", value: "as-IN" },
    { label: "संस्कृत", value: "sa-IN" },
    { label: "कोंकणी", value: "kok-IN" },
    { label: "नेपाली", value: "ne-IN" },
    { label: "মৈতৈলোন্", value: "mni-IN" },
    { label: "डोगरी", value: "doi-IN" },
    { label: "سنڌي", value: "sd-IN" },
    { label: "कॉशुर", value: "ks-IN" },
  
  ];

export default function VoicePage() {

  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const [language, setLanguage] = useState("en-US");

  const recognitionRef = useRef<any>(null);

  // Ask AI
  const handleAskAI = async (customMessage?: string) => {

    const finalMessage = customMessage || message;

    if (!finalMessage) return;

    try {

      setLoading(true);

      const res = await axios.post("/api/chat", {
        message: finalMessage,
      });

      const aiReply = res.data.reply;

      setReply(aiReply);

      // Speak AI response
      const speech = new SpeechSynthesisUtterance(aiReply);

      speech.lang = language;

      window.speechSynthesis.cancel();

      window.speechSynthesis.speak(speech);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // Start listening
  const startListening = () => {

    const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language;

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event: any) => {
      console.log(event.error);
      setListening(false);
    };

    recognition.onresult = (event: any) => {

      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setMessage(transcript);
    };

    recognition.start();

    recognitionRef.current = recognition;
  };

  // Stop listening
  const stopListening = async () => {

    recognitionRef.current?.stop();

    setListening(false);

    if (message.trim()) {
      await handleAskAI(message);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <h1 className="text-5xl font-bold">
            Bharat Voice Assistant
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Speak naturally in any Indian language.
          </p>

        </div>

        {/* Main Voice Area */}
        <div className="mt-10 rounded-[40px] border border-white/10 bg-white/5 min-h-[750px] relative overflow-hidden flex flex-col items-center justify-center">

          {/* Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[140px]" />

          {/* Orb */}
          <motion.div
            animate={{
              scale: listening
                ? [1, 1.25, 1]
                : [1, 1.08, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className={`relative z-10 w-72 h-72 rounded-full blur-2xl opacity-90 ${
              listening
                ? "bg-gradient-to-r from-red-500 to-pink-500"
                : "bg-gradient-to-r from-purple-500 to-blue-500"
            }`}
          />

          {/* Controls */}
          <div className="relative z-20 mt-12 flex gap-6 items-center">

            {/* Language Dropdown */}
            <div className="relative">

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-white/10 border border-white/10 rounded-2xl px-5 py-4 pr-10 outline-none text-white"
              >
                {languages.map((lang) => (
                  <option
                    key={lang.value}
                    value={lang.value}
                    className="bg-[#050816]"
                  >
                    {lang.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

            </div>

            {/* Mic */}
            {!listening ? (
              <button
                onClick={startListening}
                className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center hover:scale-110 transition-all shadow-2xl shadow-purple-500/30"
              >
                <Mic size={38} />
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center hover:scale-110 transition-all shadow-2xl shadow-red-500/30"
              >
                <Square size={30} />
              </button>
            )}

            {/* Stop Voice */}
            <button
              onClick={() => window.speechSynthesis.cancel()}
              className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >
              <Volume2 />
            </button>

          </div>

          {/* Status */}
          <div className="relative z-20 mt-6">

            {listening ? (
              <p className="text-red-400 animate-pulse text-lg">
                Listening...
              </p>
            ) : loading ? (
              <p className="text-purple-300 animate-pulse text-lg">
                AI is thinking...
              </p>
            ) : (
              <p className="text-gray-400 text-lg">
                Ready
              </p>
            )}

          </div>

          {/* Transcript */}
          <div className="relative z-20 mt-14 max-w-3xl text-center w-full px-6">

            <p className="uppercase tracking-[0.3em] text-purple-300 text-sm mb-5">
              Live Transcript
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Speak or type something..."
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-5 outline-none text-center text-xl min-h-[160px]"
            />

            <button
              onClick={() => handleAskAI()}
              className="mt-6 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition-all"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>

          </div>

          {/* AI Response */}
          <div className="relative z-20 mt-14 max-w-4xl w-full px-6 mb-20">

            <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8">

              <p className="text-purple-300 mb-4 uppercase tracking-[0.2em] text-sm">
                AI Response
              </p>

              <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                {reply || "AI response will appear here..."}
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}