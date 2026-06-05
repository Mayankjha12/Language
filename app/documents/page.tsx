"use client";

import { useState } from "react";
import axios from "axios";

export default function DocumentsPage() {

  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {

    try {
  
      if (!file) {
        alert("Please select a file first");
        return;
      }
  
      setLoading(true);
  
      const formData = new FormData();
  
      formData.append("file", file);
  
      const uploadRes = await axios.post(
        "/api/document-upload",
        formData
      );
  
      const extractedText =
        uploadRes.data.text;
  
      const analyzeRes =
        await axios.post(
          "/api/document-analyze",
          {
            documentText:
              extractedText,
          }
        );
  
      setSummary(
        analyzeRes.data.summary
      );
  
    } catch (error) {
  
      console.log(error);
  
      setSummary(
        "Failed to analyze document."
      );
  
    } finally {
  
      setLoading(false);
  
    }
  
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <h1 className="text-5xl font-bold">
            AI Document Explainer
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Upload any official document and get plain-language AI summaries.
          </p>

        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          {/* Upload Box */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <div className="border-2 border-dashed border-white/10 rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-center px-8">

              <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center text-5xl mb-8">
                ↑
              </div>

              <h2 className="text-3xl font-semibold">
                Upload Document
              </h2>

              <p className="text-gray-400 mt-4">
                PDF, TXT, JPG, PNG up to 20MB
              </p>

              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] || null
                  )
                }
                className="mt-6"
              />

              {file && (
                <p className="mt-4 text-purple-300">
                  {file.name}
                </p>
              )}

              <button
                onClick={handleAnalyze}
                className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600"
              >
                {loading
                  ? "Analyzing..."
                  : "Analyze Document"}
              </button>

            </div>

          </div>

          {/* AI Summary */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="text-3xl font-bold mb-8">
              AI Summary
            </h2>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 min-h-[400px]">

              {loading ? (

                <p className="text-purple-300">
                  Analyzing document...
                </p>

              ) : (

                <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                  {summary ||
                    "Upload a document and click Analyze Document to generate an AI explanation."}
                </pre>

              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}