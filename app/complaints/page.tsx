"use client";

import { useState } from "react";
import axios from "axios";

export default function ComplaintsPage() {

  const [issue, setIssue] = useState("");
  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState("");

  const [department, setDepartment] =
    useState("");

  const [complaint, setComplaint] =
    useState("");

  const [recommendations, setRecommendations] =
    useState<string[]>([]);

  const [questions, setQuestions] =
    useState<string[]>([]);

  const [answers, setAnswers] =
    useState<Record<string, string>>({});

  const [loading, setLoading] =
    useState(false);

  const [language, setLanguage] =
    useState("english");

  const generateComplaint = async () => {

    try {

      setLoading(true);

      const res = await axios.post(
        "/api/complaints",
        {
          issue,
          issueType,
          priority,
          answers,
          language,
        }
      );

      setDepartment(
        res.data.department
      );

      setComplaint(
        res.data.complaint
      );

      setRecommendations(
        res.data.recommendations?.length
          ? res.data.recommendations
          : [
              "Add exact location details",
              "Keep supporting evidence ready",
              "Mention issue duration clearly",
              "Include contact details",
            ]
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const askQuestions = async () => {

    try {

      const res = await axios.post(
        "/api/complaints/questions",
        {
          issue,
          issueType,
          language,
        }
      );

      setQuestions(
        res.data.questions || []
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <h1 className="text-5xl font-bold">
            AI Complaint Assistant
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Describe your issue. AI drafts a formal complaint instantly.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

{/* Input Side */}
<div className="rounded-3xl border border-white/10 bg-white/5 p-8">

  <h2 className="text-2xl font-semibold mb-6">
    Describe your issue
  </h2>

  <textarea
    rows={10}
    value={issue}
    onChange={(e) =>
      setIssue(e.target.value)
    }
    placeholder="Example: There is no water supply in my area since 3 days..."
    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none resize-none"
  />

  {questions.length > 0 && (

    <div className="mt-6 space-y-4">

      <h3 className="text-lg font-semibold text-purple-300">
        AI Follow-up Questions
      </h3>

      {questions.map((question, index) => (

        <div key={index}>

          <label className="block mb-2 text-gray-300">
            {question}
          </label>

          <input
            type="text"
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none"
            onChange={(e) =>
              setAnswers({
                ...answers,
                [question]:
                e.target.value,
              })
            }
          />

        </div>

      ))}

    </div>

  )}

  <div className="grid md:grid-cols-3 gap-5 mt-6">

    <select
      value={issueType}
      onChange={(e) =>
        setIssueType(e.target.value)
      }
      className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none"
    >
      <option value="">
        Issue Type
      </option>

      <option value="Water Supply">
        Water Supply
      </option>

      <option value="Electricity">
        Electricity
      </option>

      <option value="Road Damage">
        Road Damage
      </option>

      <option value="Garbage">
        Garbage
      </option>

    </select>

    <select
      value={language}
      onChange={(e) =>
        setLanguage(e.target.value)
      }
      className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none"
    >
      <option value="english">
        English
      </option>

      <option value="hindi">
        Hindi
      </option>

    </select>

    <select
      value={priority}
      onChange={(e) =>
        setPriority(e.target.value)
      }
      className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none"
    >
      <option value="">
        Priority
      </option>

      <option value="Low">
        Low
      </option>

      <option value="Medium">
        Medium
      </option>

      <option value="Urgent">
        Urgent
      </option>

    </select>

  </div>

  <button
    onClick={askQuestions}
    disabled={!issue}
    className="w-full mb-4 mt-6 py-4 rounded-full border border-white/10 bg-white/5"
  >
    AI Ask Questions
  </button>

  <button
    onClick={generateComplaint}
    disabled={!issue}
    className="w-full mt-4 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-[1.02] transition-all"
  >
    {loading
      ? "Generating..."
      : "Generate Complaint"}
  </button>

</div>

          {/* AI Output */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="text-3xl font-bold mb-8">
              AI Generated Complaint
            </h2>

            <div className="space-y-6">

              {/* Department */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">

                <h3 className="text-xl font-semibold mb-3">
                  Detected Department
                </h3>

                <p className="text-gray-400">
                  {department ||
                    "Department will be detected automatically"}
                </p>

                {complaint && (

                  <div className="flex flex-wrap gap-3 mt-4">

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          complaint
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600"
                    >
                      Copy Complaint
                    </button>

                    <a
                      href="https://pgportal.gov.in"
                      target="_blank"
                      className="px-4 py-2 rounded-xl border border-white/10"
                    >
                      Submit Online
                    </a>

                  </div>

                )}

              </div>

              {/* Complaint Draft */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">

                <h3 className="text-xl font-semibold mb-3">
                  Complaint Draft
                </h3>

                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {complaint ||
                    "Your AI-generated complaint will appear here."}
                </p>

              </div>

              {/* Next Steps */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">

                <h3 className="text-xl font-semibold mb-3">
                  Next Steps
                </h3>

                {complaint ? (

                  <div className="space-y-3">

                    <a
                      href="https://pgportal.gov.in"
                      target="_blank"
                      className="block p-4 rounded-xl bg-white/10 border border-white/10 hover:border-purple-500"
                    >
                      File Complaint on PG Portal
                    </a>

                    <a
                      href="https://consumerhelpline.gov.in"
                      target="_blank"
                      className="block p-4 rounded-xl bg-white/10 border border-white/10 hover:border-purple-500"
                    >
                      Consumer Helpline Portal
                    </a>

                    <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                      Recommended Department:{" "}
                      {department || "Not detected"}
                    </div>

                  </div>

                ) : (

                  <p className="text-gray-400">
                    Generate a complaint to see suggested actions.
                  </p>

                )}

              </div>

              {/* Recommendations */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">

                <h3 className="text-xl font-semibold mb-3">
                  AI Recommendations & Guidance
                </h3>

                <ul className="text-gray-400 space-y-2">

                  {recommendations.length > 0 ? (

                    recommendations.map(
                      (item, index) => (
                        <li key={index}>
                          • {item}
                        </li>
                      )
                    )

                  ) : (

                    <li>
                      • AI recommendations will appear here
                    </li>

                  )}

                </ul>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}