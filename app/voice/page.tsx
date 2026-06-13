"use client";

import { Mic, Volume2, Square, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  { id: 19, label: "মৈতৈলোन्", value: "mni-IN" },
  { id: 20, label: "डोगरी", value: "doi-IN" },
  { id: 21, label: "سنڌي", value: "sd-IN" },
  { id: 22, label: "कॉशुर", value: "ks-IN" }
];

export default function VoicePage() {
  const openServiceText: Record<string, string> = {
    "en-US": "Open Recommended Service", "hi-IN": "अनुशंसित सेवा खोलें", "bn-IN": "প্রস্তাবিত পরিষেবা খুলুন",
    "ta-IN": "பரிந்துரைக்கப்பட்ட சேவையைத் திறக்கவும்", "te-IN": "సిఫార్సు చేసిన सేవను తెరవండి", "mr-IN": "शिफारस केलेली सेवा उघडा",
    "gu-IN": "ભલામણ કરેલી સેવા ખોલો", "pa-IN": "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਸੇਵਾ ਖੋਲ੍ਹੋ", "kn-IN": "ಶಿಫਾਰಸು ಮಾಡಿದ ಸೇವೆ ತೆರೆಯಿರಿ",
    "ml-IN": "ശുപാർശ ചെയ്ത സേവനം തുറക്കുക", "or-IN": "ପ୍ରସ୍ତାବିତ ସେବା ଖୋଲନ୍ତୁ", "ur-IN": "تجویز کردہ سروس کھولیں",
    "as-IN": "পৰামৰ্শ দিয়া সেৱা খোলক", "mai-IN": "সুझाओल सेवा खोलू", "bho-IN": "সুझावल सेवा खोलीं",
    "sa-IN": "अनुशंसितसेवां उद्घाटयतु", "kok-IN": "शिफारस केलेली सेवा उघडा", "ne-IN": "сиफारिश गरिएको सेवा खोल्नुहोस्",
    "mni-IN": "Recommended Service Open Tou", "doi-IN": "सिफारिश कित्ती सेवा खोलो", "sd-IN": "تجويز ڪيل سروس ڪوليو",
    "ks-IN": "تجویز کرمُت سروس کُلِو"
  };

  const uiText: Record<string, {
    title: string; subtitle: string; listening: string; thinking: string; ready: string;
    transcript: string; placeholder: string; response: string; defaultResponse: string;
  }> = {
    "en-US": { title: "Maya", subtitle: "Your multilingual government assistant", listening: "Listening... Speak naturally", thinking: "AI is thinking...", ready: "Ready", transcript: "Live Transcript Panel", placeholder: "Speak something...", response: "AI Response", defaultResponse: "Awaiting voice input..." },
    "hi-IN": { title: "माया", subtitle: "आपकी बहुभाषी सरकारी सहायक", listening: "सुन रही हूँ... सहजता से बोलें", thinking: "सोच रही हूँ...", ready: "तैयार", transcript: "लाइव ट्रांसक्रिप्ट", placeholder: "कुछ बोलिए...", response: "उत्तर", defaultResponse: "बोलना शुरू करें..." },
    "bn-IN": { title: "মায়া", subtitle: "আপনার বহুভাষিক সরকারি সহকারী", listening: "শুনছি...", thinking: "ভাবছি...", ready: "প্রস্তুত", transcript: "লাইভ ট্রান্সক্রিপ্ট", placeholder: "কিছু বলুন...", response: "উত্তর", defaultResponse: "কথা বলা শুরু করুন..." },
    "ta-IN": { title: "மாயா", subtitle: "உங்கள் பலமொழி அரசு உதவியாளர்", listening: "கேட்டுக்கொண்டு இருக்கிறேன்...", thinking: "யோசித்து கொண்டிருக்கிறேன்...", ready: "தயார்", transcript: "நேரடி உரை", placeholder: "ஏதாவது பேசுங்கள்...", response: "பதில்", defaultResponse: "பேசத் தொடங்குங்கள்..." }
  };

  const [languageSelected, setLanguageSelected] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [intent, setIntent] = useState("");
  const [suggestedPage, setSuggestedPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isProcessing = useRef(false);

  const playSystemWelcomeSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    const dynamicWelcomeScript = 
      "Welcome to JanMitra AI. For English press 1. हिंदी के लिए 2 दबाइए। বাংলার জন্য 3 চাপুন। தமிழுக்கு 4 அழுத்தவும்.";
    const utterance = new SpeechSynthesisUtterance(dynamicWelcomeScript);
    utterance.lang = "hi-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    const unlockAndPlay = () => {
      if (!hasInteracted && !languageSelected) {
        setHasInteracted(true);
        playSystemWelcomeSpeech();
      }
      window.removeEventListener("click", unlockAndPlay);
    };
    window.addEventListener("click", unlockAndPlay);
    return () => window.removeEventListener("click", unlockAndPlay);
  }, [hasInteracted, languageSelected, playSystemWelcomeSpeech]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (languageSelected) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= languages.length) {
        handleLanguageSelect(languages[num - 1].value);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [languageSelected]);

  // 🌟 CONVERSATIONAL AUTOMATION DETECTOR LOOP
  const startConversationalEngine = async () => {
    if (currentAudioRef.current) currentAudioRef.current.pause();
    if (isProcessing.current) return;
    
    audioChunksRef.current = [];
    console.log("🎙️ Opening Automated Mic Sensor Grid Pipeline.");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.start(100);
      setListening(true);

      let lastVocalActivity = Date.now();
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const inspectAudioWaves = () => {
        if (!recorder || recorder.state !== "recording" || isProcessing.current) return;
        
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const currentAmplitude = sum / bufferLength;

        // Reset tracking timer if voice peaks above general environmental floor boundaries
        if (currentAmplitude > 14) {
          lastVocalActivity = Date.now();
        } else {
          const silenceInterval = Date.now() - lastVocalActivity;
          if (silenceInterval > 3200) { // 3.2s automated closure threshold
            console.log("⚡ Silence detected, parsing payload block.");
            isProcessing.current = true;
            stopListeningAndSubmitData(recorder);
            return;
          }
        }
        animationFrameRef.current = requestAnimationFrame(inspectAudioWaves);
      };

      requestAnimationFrame(inspectAudioWaves);
    } catch (error) {
      console.error("Microphone loop denied context tracker:", error);
    }
  };

  const stopListeningAndSubmitData = async (activeRecorder: MediaRecorder) => {
    setListening(false);
    if (!activeRecorder || activeRecorder.state === "inactive") return;

    activeRecorder.onstop = async () => {
      try {
        setLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", new File([audioBlob], "voice.webm", { type: "audio/webm" }));
        formData.append("language", language);

        // STT Pipeline Endpoint Call
        const sttResponse = await fetch("/api/stt", { method: "POST", body: formData });
        const sttData = await sttResponse.json();
        const transcriptText = sttData.transcript || "";

        if (!transcriptText.trim() || transcriptText.length < 2) {
          console.log("Empty whisper chunk, re-spinning microphone node.");
          isProcessing.current = false;
          setLoading(false);
          startConversationalEngine();
          return;
        }

        setMessage(transcriptText);

        // Routed cleanly to our fresh localized Voice API router endpoint!
        const voiceRes = await axios.post("/api/voice", { message: transcriptText, language });
        const aiReply = voiceRes.data.reply;
        const aiIntent = voiceRes.data.intent;

        setReply(aiReply);
        setIntent(aiIntent);

        const routeMap: Record<string, string> = {
          schemes: "/ask-ai",
          complaints: "/ask-ai", // Directly matches your inner tabs mapping rules safely
          documents: "/ask-ai"
        };
        setSuggestedPage(routeMap[aiIntent] || "");

        // Text To Speech synthesis audio mapping trigger
        const ttsResponse = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: aiReply, languageCode: language }),
        });
        const ttsData = await ttsResponse.json();

        if (ttsData.audios?.[0]) {
          const cleanedBase64 = ttsData.audios[0].replace(/\s/g, "");
          const audio = new Audio(`data:audio/wav;base64,${cleanedBase64}`);
          currentAudioRef.current = audio;
          audio.onended = () => {
            isProcessing.current = false;
            startConversationalEngine();
          };
          await audio.play();
        } else {
          isProcessing.current = false;
          startConversationalEngine();
        }
      } catch (err) {
        console.error("Pipeline failure reset trace:", err);
        isProcessing.current = false;
        setLoading(false);
        startConversationalEngine();
      }
    };

    activeRecorder.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const triggerLocalizedGreetingConfirmation = async (selectedLang: string) => {
    window.speechSynthesis.cancel();
    const greetings: Record<string, string> = {
      "en-US": "Language mapped. Maya is online. Please speak now.",
      "hi-IN": "जी हाँ, हिंदी भाषा सक्रिय है। माया सुन रही है, कहिए।"
    };

    try {
      const response = await axios.post("/api/tts", {
        text: greetings[selectedLang] || "Language configured",
        languageCode: selectedLang
      });

      if (response.data.audios?.[0]) {
        const cleanedBase64 = response.data.audios[0].replace(/\s/g, "");
        const audio = new Audio(`data:audio/wav;base64,${cleanedBase64}`);
        currentAudioRef.current = audio;
        audio.onended = () => {
          isProcessing.current = false;
          startConversationalEngine();
        };
        await audio.play();
      } else {
        startConversationalEngine();
      }
    } catch (err) {
      startConversationalEngine();
    }
  };

  const handleLanguageSelect = (langValue: string) => {
    setLanguage(langValue);
    setLanguageSelected(true);
    triggerLocalizedGreetingConfirmation(langValue);
  };

  const forceStopAllStreams = () => {
    isProcessing.current = true;
    setListening(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => track.stop()); streamRef.current = null; }
    if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
    
    setLanguageSelected(false);
    setMessage("");
    setReply("");
    setIntent("");
    setSuggestedPage("");
    isProcessing.current = false;
  };

  const activeUI = uiText[language] || uiText["en-US"];

  if (!languageSelected) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6 font-sans">
        <div className="max-w-5xl w-full rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-10 shadow-2xl relative z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
          <h1 className="text-4xl md:text-5xl font-black text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            🇮🇳 JanMitra AI
          </h1>
          <p className="text-center text-neutral-400 mt-4 text-sm md:text-base">
            {!hasInteracted ? "Click anywhere on the screen to unlock full system audio loops..." : "Select your regional language module setup instantly below."}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageSelect(lang.value)}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-left hover:bg-purple-600/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
              >
                <div className="text-sm font-mono text-white/20 group-hover:text-purple-400 font-bold transition-colors absolute top-4 right-4">
                  {String(lang.id).padStart(2, "0")}
                </div>
                <div className="text-xl font-bold text-neutral-200 group-hover:text-white transition-colors">
                  {lang.label}
                </div>
                <div className="text-xs text-neutral-500 mt-1">JanMitra Engine Core</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden font-sans">
      <section className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8 relative z-10">
        
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
              {activeUI.title}
            </h1>
            <p className="text-gray-400 mt-2 text-sm">{activeUI.subtitle}</p>
          </div>
          <button
            onClick={forceStopAllStreams}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 transition-all text-xs font-semibold"
          >
            <ArrowLeft size={14} /> Reset Platform Parameters
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-[40px] border border-white/10 bg-white/5 min-h-[520px] relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
            <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

            <motion.div
              animate={{
                scale: listening ? [1, 1.08, 0.98, 1.03, 1] : 1,
                boxShadow: listening ? "0 0 50px rgba(244,63,94,0.2)" : "0 0 30px rgba(147,51,234,0.05)"
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`relative z-10 w-52 h-52 rounded-full flex items-center justify-center border transition-all duration-500 ${
                listening ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-purple-500/5 border-purple-500/20 text-purple-400"
              }`}
            >
              <Mic size={44} className={listening ? "animate-pulse" : ""} />
            </motion.div>

            <div className="relative z-20 mt-8 text-center">
              <p className={`text-sm font-mono tracking-widest uppercase ${listening ? "text-rose-400" : loading ? "text-purple-400" : "text-neutral-500"}`}>
                {listening ? activeUI.listening : loading ? activeUI.thinking : activeUI.ready}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 flex flex-col gap-3 shadow-lg">
              <span className="text-xs uppercase tracking-widest font-mono text-purple-400 font-bold">
                {activeUI.transcript}
              </span>
              <textarea
                readOnly
                value={message}
                placeholder={activeUI.placeholder}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 outline-none text-xl min-h-[160px] text-white resize-none font-sans"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 flex flex-col gap-4 shadow-lg relative overflow-hidden">
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold">
                {activeUI.response}
              </span>
              <p className="text-base text-neutral-200 leading-relaxed min-h-[140px] whitespace-pre-line font-sans">
                {reply || activeUI.defaultResponse}
              </p>

              {suggestedPage && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                  <a
                    href={suggestedPage}
                    className="flex items-center justify-center w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-sm tracking-wide text-center hover:opacity-90 transition-all shadow-md"
                  >
                    {openServiceText[language] || "Open Platform Service Module"}
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
}
