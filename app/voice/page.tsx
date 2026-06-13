"use client";

import { Mic, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

interface LanguageConfig {
  id: number;
  label: string;
  value: string;
}

const languages: LanguageConfig[] = [
  { id: 1, label: "English", value: "en-US" },
  { id: 2, label: "हिन्दी", value: "hi-IN" },
  { id: 3, label: "বাংলা", value: "bn-IN" },
  { id: 4, label: "தமிழ்", value: "ta-IN" },
  { id: 5, label: "తెలుగు", value: "te-IN" },
  { id: 6, label: "मराठी", value: "mr-IN" },
  { id: 7, label: "ગુજરાતી", value: "gu-IN" },
  { id: 8, label: "ਪੰਜਾਬੀ", value: "pa-IN" },
  { id: 9, label: "ಕನ್ನಡ", value: "kn-IN" },
  { id: 10, label: "മലയാളം", value: "ml-IN" },
  { id: 11, label: "ଓଡ଼ିଆ", value: "or-IN" },
  { id: 12, label: "اردو", value: "ur-IN" },
  { id: 13, label: "অসমীয়া", value: "as-IN" },
  { id: 14, label: "मैथिली", value: "mai-IN" },
  { id: 15, label: "भोजपुरी", value: "bho-IN" },
  { id: 16, label: "संस्कृत", value: "sa-IN" },
  { id: 17, label: "कोंकणी", value: "kok-IN" },
  { id: 18, label: "नेपाली", value: "ne-IN" },
  { id: 19, label: "मৈতৈলোन्", value: "mni-IN" },
  { id: 20, label: "डोगरी", value: "doi-IN" },
  { id: 21, label: "سنڌي", value: "sd-IN" },
  { id: 22, label: "कॉशुर", value: "ks-IN" }
];

export default function VoicePage() {
  const openServiceText: Record<string, string> = {
    "en-US": "Open Recommended Service", "hi-IN": "अनुशंसित सेवा खोलें"
  };

  const uiText: Record<string, {
    title: string; subtitle: string; listening: string; thinking: string; ready: string;
    transcript: string; placeholder: string; response: string; defaultResponse: string;
  }> = {
    "en-US": { title: "Maya", subtitle: "Your multilingual government assistant", listening: "Listening... Speak naturally", thinking: "AI is thinking...", ready: "Ready", transcript: "Live Transcript Panel", placeholder: "Speak something...", response: "AI Response", defaultResponse: "Awaiting voice input..." },
    "hi-IN": { title: "माया", subtitle: "आपकी बहुभाषी सरकारी सहायक", listening: "सुन रही हूँ... सहजता से बोलें", thinking: "सोच रही हूँ...", ready: "तैयार", transcript: "लाइव ट्रांसक्रिप्ट", placeholder: "कुछ बोलिए...", response: "उत्तर", defaultResponse: "बोलना शुरू करें..." }
  };

  const [languageSelected, setLanguageSelected] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [suggestedPage, setSuggestedPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isProcessing = useRef(false);

  const playSystemWelcomeSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    const welcomeText = "Welcome to JanMitra AI. For English press 1. हिंदी के लिए 2 दबाइए।";
    const utterance = new SpeechSynthesisUtterance(welcomeText);
    utterance.lang = "hi-IN";
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      if (!hasInteracted && !languageSelected) {
        setHasInteracted(true);
        playSystemWelcomeSpeech();
      }
      window.removeEventListener("click", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, [hasInteracted, languageSelected, playSystemWelcomeSpeech]);

  const startConversationalEngine = async () => {
    if (isProcessing.current) return;
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.start();
      setListening(true);
      setTimeout(() => { if (recorder.state === "recording") stopListeningAndSubmitData(recorder); }, 5000);
    } catch (err) { console.error("Mic Access Error:", err); }
  };

  const stopListeningAndSubmitData = async (recorder: MediaRecorder) => {
    setListening(false);
    recorder.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    isProcessing.current = true;
    setLoading(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", new File([audioBlob], "voice.webm"));
      formData.append("language", language);

      const sttRes = await fetch("/api/stt", { method: "POST", body: formData });
      const sttData = await sttRes.json();
      setMessage(sttData.transcript || "...");

      const aiRes = await axios.post("/api/voice", { message: sttData.transcript, language });
      setReply(aiRes.data.reply);
      setSuggestedPage(aiRes.data.intent !== "none" ? "/ask-ai" : "");

      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiRes.data.reply, languageCode: language }),
      });
      const ttsData = await ttsRes.json();
      
      if (ttsData.audios?.[0]) {
        const audio = new Audio(`data:audio/wav;base64,${ttsData.audios[0].replace(/\s/g, "")}`);
        currentAudioRef.current = audio;
        audio.onended = () => { isProcessing.current = false; startConversationalEngine(); };
        await audio.play();
      } else {
        isProcessing.current = false;
        startConversationalEngine();
      }
    } catch (e) {
      isProcessing.current = false;
      startConversationalEngine();
    } finally { setLoading(false); }
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setLanguageSelected(true);
    setTimeout(startConversationalEngine, 1000);
  };

  const activeUI = uiText[language] || uiText["en-US"];

  return (
    <main className="min-h-screen bg-[#050816] text-white p-10 font-sans">
      {!languageSelected ? (
        <div className="max-w-4xl mx-auto text-center mt-20">
          <h1 className="text-5xl font-black mb-10">Select Language</h1>
          <div className="grid grid-cols-3 gap-4">
            {languages.map((l) => (
              <button key={l.id} onClick={() => handleLanguageSelect(l.value)} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-purple-600/20">{l.label}</button>
            ))}
          </div>
        </div>
      ) : (
        <section className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold">{activeUI.title}</h1>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white/10 rounded-lg">Reset</button>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className={`h-80 rounded-[40px] flex items-center justify-center border ${listening ? "border-rose-500 bg-rose-500/10" : "border-white/10 bg-white/5"}`}>
              <Mic size={64} className={listening ? "animate-pulse text-rose-500" : "text-white"} />
            </div>
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-2xl">
                <p className="text-gray-400 text-xs font-bold uppercase">{activeUI.transcript}</p>
                <p className="text-xl mt-2">{message || "Listening..."}</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl">
                <p className="text-gray-400 text-xs font-bold uppercase">{activeUI.response}</p>
                <p className="text-xl mt-2">{reply || activeUI.defaultResponse}</p>
                {suggestedPage && (
                  <a href={suggestedPage} className="block mt-4 text-center bg-blue-600 py-3 rounded-lg font-bold">Open Service</a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
