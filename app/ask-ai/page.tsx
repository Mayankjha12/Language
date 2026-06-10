"use client";

import { useState } from "react";
import axios from "axios";

type Tab =
  | "home"
  | "schemes"
  | "complaints"
  | "documents"
  | "help";

export default function AskAIPage() {

  const [activeTab, setActiveTab] =
    useState<Tab>("home");

  // =========================
  // GOVERNMENT HELP
  // =========================

  const [message, setMessage] =
    useState("");

  const [reply, setReply] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // SCHEMES
  // =========================

  const [schemeForm, setSchemeForm] =
    useState({
      age: "",
      income: "",
      occupation: "",
      category: "",
      gender: "",
      state: "",
    });

  const [schemes, setSchemes] =
    useState<any[]>([]);

  const [schemeLoading, setSchemeLoading] =
    useState(false);

  const [aiExplanation, setAiExplanation] =
    useState("");

  // =========================
  // COMPLAINTS
  // =========================

  const [issue, setIssue] =
    useState("");

  const [issueType, setIssueType] =
    useState("");

  const [priority, setPriority] =
    useState("");

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

  const [language, setLanguage] =
    useState("english");

  const [complaintLoading, setComplaintLoading] =
    useState(false);

  // =========================
  // DOCUMENTS
  // =========================

  const [file, setFile] =
    useState<File | null>(null);

  const [summary, setSummary] =
    useState("");

  const [documentLoading, setDocumentLoading] =
    useState(false);

  // =========================
  // GOVERNMENT HELP
  // =========================

  const askAI = async () => {

    try {

      setLoading(true);

      const res = await axios.post(
        "/api/chat",
        {
          message,
        }
      );

      setReply(res.data.reply);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // SCHEMES
  // =========================

  const handleSchemeChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setSchemeForm({
      ...schemeForm,
      [e.target.name]:
        e.target.value,
    });

  };

  const findSchemes = async () => {

    try {

      setSchemeLoading(true);

      const res =
        await axios.post(
          "/api/schemes",
          {
            age: Number(
              schemeForm.age
            ),

            income: Number(
              schemeForm.income
            ),

            occupation:
              schemeForm.occupation,

            category:
              schemeForm.category,

            gender:
              schemeForm.gender,

            state:
              schemeForm.state,
          }
        );

      setSchemes(
        res.data.schemes || []
      );

      setAiExplanation(
        res.data.aiExplanation || ""
      );

    } catch (error) {

      console.log(error);

    } finally {

      setSchemeLoading(false);

    }

  };

  // =========================
  // COMPLAINTS
  // =========================

  const askQuestions = async () => {

    try {

      const res =
        await axios.post(
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

  const generateComplaint =
    async () => {

      try {

        setComplaintLoading(
          true
        );

        const res =
          await axios.post(
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
          res.data
            .recommendations ||
            []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setComplaintLoading(
          false
        );

      }

    };

  // =========================
  // DOCUMENTS
  // =========================

  const handleAnalyze =
    async () => {

      try {

        if (!file) return;

        setDocumentLoading(
          true
        );

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const uploadRes =
          await axios.post(
            "/api/document-upload",
            formData
          );

        const analyzeRes =
          await axios.post(
            "/api/document-analyze",
            {
              documentText:
                uploadRes.data.text,
            }
          );

        setSummary(
          analyzeRes.data.summary
        );

      } catch (error) {

        console.log(error);

      } finally {

        setDocumentLoading(
          false
        );

      }

    };

  return (

    <main className="min-h-screen bg-[#050816] text-white">

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h1 className="text-5xl font-bold">
            Ask JanMitra AI
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            One intelligent assistant for schemes,
            complaints, documents and governance support.
          </p>

        </div>

        {activeTab === "home" && (

<>

  <div className="mt-10 text-center">

    <h2 className="text-3xl font-bold">
      How can I help you today?
    </h2>

    <p className="text-gray-400 mt-3">
      Popular citizen tasks
    </p>

  </div>

  <div className="grid md:grid-cols-2 gap-6 mt-10">

    <button
      onClick={() =>
        setActiveTab("schemes")
      }
      className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left hover:border-purple-500 transition-all"
    >

      <div className="text-4xl mb-4">
        🎯
      </div>

      <h3 className="text-2xl font-semibold">
        Discover Eligible Schemes
      </h3>

      <p className="text-gray-400 mt-3">
        Find government schemes based on
        your profile.
      </p>

    </button>

    <button
      onClick={() =>
        setActiveTab("complaints")
      }
      className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left hover:border-purple-500 transition-all"
    >

      <div className="text-4xl mb-4">
        📝
      </div>

      <h3 className="text-2xl font-semibold">
        Draft & File Complaints
      </h3>

      <p className="text-gray-400 mt-3">
        Generate formal complaints and
        identify the right department.
      </p>

    </button>

    <button
      onClick={() =>
        setActiveTab("documents")
      }
      className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left hover:border-purple-500 transition-all"
    >

      <div className="text-4xl mb-4">
        📄
      </div>

      <h3 className="text-2xl font-semibold">
        Understand Documents
      </h3>

      <p className="text-gray-400 mt-3">
        Upload and simplify government
        documents instantly.
      </p>

    </button>

    <button
      onClick={() =>
        setActiveTab("help")
      }
      className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left hover:border-purple-500 transition-all"
    >

      <div className="text-4xl mb-4">
        💬
      </div>

      <h3 className="text-2xl font-semibold">
        Talk to JanMitra
      </h3>

      <p className="text-gray-400 mt-3">
        Ask anything related to government
        services.
      </p>

    </button>

  </div>

</>

)}

{activeTab !== "home" && (

<div className="mt-10">

  <button
    onClick={() =>
      setActiveTab("home")
    }
    className="mb-6 px-6 py-3 rounded-full bg-white/10 border border-white/10"
  >
    ← Back
  </button>

  {activeTab === "schemes" && (

<div className="grid lg:grid-cols-2 gap-8">

  <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

    <h2 className="text-3xl font-bold mb-8">
      Discover Eligible Schemes
    </h2>

    <div className="space-y-5">

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={schemeForm.age}
        onChange={handleSchemeChange}
        className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4"
      />

      <input
        type="number"
        name="income"
        placeholder="Annual Income"
        value={schemeForm.income}
        onChange={handleSchemeChange}
        className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4"
      />

      <input
        type="text"
        name="state"
        placeholder="State"
        value={schemeForm.state}
        onChange={handleSchemeChange}
        className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4"
      />

      <select
        name="occupation"
        value={schemeForm.occupation}
        onChange={handleSchemeChange}
        className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4"
      >
        <option value="">Occupation</option>
        <option value="student">Student</option>
        <option value="farmer">Farmer</option>
        <option value="worker">Worker</option>
        <option value="business">Business</option>
      </select>

      <select
        name="category"
        value={schemeForm.category}
        onChange={handleSchemeChange}
        className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4"
      >
        <option value="">Category</option>
        <option value="general">General</option>
        <option value="obc">OBC</option>
        <option value="sc">SC</option>
        <option value="st">ST</option>
      </select>

      <select
        name="gender"
        value={schemeForm.gender}
        onChange={handleSchemeChange}
        className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4"
      >
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <button
        onClick={findSchemes}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600"
      >
        {schemeLoading
          ? "Finding..."
          : "Find My Schemes"}
      </button>

    </div>

  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

    <h2 className="text-3xl font-bold mb-8">
      Recommended Schemes
    </h2>

    {schemes.length === 0 ? (

      <p className="text-gray-400">
        Complete your profile to discover schemes.
      </p>

    ) : (

      <div className="space-y-5">

        {schemes.map(
          (scheme, index) => (

            <a
              key={index}
              href={`/schemes/${scheme.id}`}
              className="block rounded-2xl border border-white/10 bg-white/10 p-5 hover:border-purple-500"
            >

              <h3 className="text-xl font-semibold">
                {scheme.name}
              </h3>

              <p className="text-gray-400 mt-3">
                {scheme.description}
              </p>

            </a>

          )
        )}

        {aiExplanation && (

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">

            <h3 className="font-semibold mb-3">
              AI Recommendation
            </h3>

            <p className="whitespace-pre-wrap text-gray-300">
              {aiExplanation}
            </p>

          </div>

        )}

      </div>

    )}

  </div>

</div>

)}

{activeTab === "complaints" && (

<div className="grid lg:grid-cols-2 gap-8">

  {/* Left Side */}

  <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

    <h2 className="text-3xl font-bold mb-6">
      Complaint Assistant
    </h2>

    <textarea
      rows={8}
      value={issue}
      onChange={(e) =>
        setIssue(e.target.value)
      }
      placeholder="Describe your issue..."
      className="w-full bg-white/10 border border-white/10 rounded-2xl p-5 outline-none"
    />

    <div className="grid md:grid-cols-3 gap-4 mt-6">

      <select
        value={issueType}
        onChange={(e) =>
          setIssueType(
            e.target.value
          )
        }
        className="bg-white/10 border border-white/10 rounded-xl px-4 py-4"
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
          setLanguage(
            e.target.value
          )
        }
        className="bg-white/10 border border-white/10 rounded-xl px-4 py-4"
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
          setPriority(
            e.target.value
          )
        }
        className="bg-white/10 border border-white/10 rounded-xl px-4 py-4"
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
      className="w-full mt-6 py-4 rounded-xl bg-white/10 border border-white/10"
    >
      AI Ask Questions
    </button>

    {questions.length > 0 && (

      <div className="mt-8 space-y-4">

        {questions.map(
          (
            question,
            index
          ) => (

            <div
              key={index}
            >

              <label className="block mb-2 text-gray-300">
                {question}
              </label>

              <input
                type="text"
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3"
                onChange={(
                  e
                ) =>
                  setAnswers({
                    ...answers,
                    [question]:
                      e.target
                        .value,
                  })
                }
              />

            </div>

          )
        )}

      </div>

    )}

    <button
      onClick={
        generateComplaint
      }
      className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600"
    >
      {complaintLoading
        ? "Generating..."
        : "Generate Complaint"}
    </button>

  </div>

  {/* Right Side */}

  <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

    <h2 className="text-3xl font-bold mb-6">
      AI Generated Complaint
    </h2>

    <div className="space-y-5">

      <div className="rounded-2xl bg-white/10 border border-white/10 p-5">

        <h3 className="font-semibold mb-3">
          Department
        </h3>

        <p className="text-gray-300">
          {department ||
            "Department will appear here"}
        </p>

      </div>

      <div className="rounded-2xl bg-white/10 border border-white/10 p-5">

        <h3 className="font-semibold mb-3">
          Complaint Draft
        </h3>

        <pre className="whitespace-pre-wrap text-gray-300">
          {complaint ||
            "Complaint draft will appear here"}
        </pre>

      </div>

      {complaint && (

        <button
          onClick={() =>
            navigator.clipboard.writeText(
              complaint
            )
          }
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600"
        >
          Copy Complaint
        </button>

      )}

      <a
        href="https://pgportal.gov.in"
        target="_blank"
        className="block text-center py-4 rounded-xl bg-white/10 border border-white/10"
      >
        Submit on PG Portal
      </a>

      <div className="rounded-2xl bg-white/10 border border-white/10 p-5">

        <h3 className="font-semibold mb-3">
          AI Recommendations
        </h3>

        <ul className="space-y-2">

          {recommendations
            .length > 0 ? (

            recommendations.map(
              (
                item,
                index
              ) => (

                <li
                  key={
                    index
                  }
                >
                  • {item}
                </li>

              )
            )

          ) : (

            <li>
              Recommendations
              will appear
              here.
            </li>

          )}

        </ul>

      </div>

    </div>

  </div>

</div>

)}

{activeTab === "documents" && (

<div className="grid lg:grid-cols-2 gap-8">

  <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

    <h2 className="text-3xl font-bold mb-6">
      Document Explainer
    </h2>

    <div className="border-2 border-dashed border-white/10 rounded-3xl min-h-[350px] flex flex-col items-center justify-center">

      <div className="text-5xl mb-6">
        📄
      </div>

      <input
        type="file"
        accept=".docx,.txt"
        onChange={(e) =>
          setFile(
            e.target.files?.[0] || null
          )
        }
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
        {documentLoading
          ? "Analyzing..."
          : "Analyze Document"}
      </button>

    </div>

  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

    <h2 className="text-3xl font-bold mb-6">
      AI Summary
    </h2>

    <div className="rounded-2xl bg-white/10 border border-white/10 p-6 min-h-[350px]">

      {documentLoading ? (

        <p>
          Analyzing document...
        </p>

      ) : (

        <pre className="whitespace-pre-wrap text-gray-300">
          {summary ||
            "Upload a document to generate summary."}
        </pre>

      )}

    </div>

  </div>

</div>

)}

{activeTab === "help" && (

<div className="rounded-3xl border border-white/10 bg-white/5 p-8">

  <h2 className="text-3xl font-bold mb-6">
    Government Help Assistant
  </h2>

  <textarea
    rows={7}
    value={message}
    onChange={(e) =>
      setMessage(e.target.value)
    }
    placeholder="Ask anything about schemes, certificates, pensions, documents, government services..."
    className="w-full rounded-2xl bg-white/10 border border-white/10 p-5 outline-none"
  />

  <button
    onClick={askAI}
    className="mt-6 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600"
  >
    {loading
      ? "Thinking..."
      : "Ask JanMitra"}
  </button>

  <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-6 min-h-[250px]">

    <pre className="whitespace-pre-wrap text-gray-300">
      {reply ||
        "AI response will appear here."}
    </pre>

  </div>

</div>

)}

</div>

)}

</section>

</main>

);

}