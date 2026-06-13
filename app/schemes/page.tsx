"use client";

import { useState } from "react";
import axios from "axios";

export default function SchemesPage() {
  interface FormState {
    age: string;
    occupation: string;
    income: string;
    category: string;
    gender: string;
    state: string;
    language: "english" | "hindi";
  }

  const [form, setForm] = useState<FormState>({
    age: "",
    occupation: "",
    income: "",
    category: "",
    gender: "",
    state: "",
    language: "english"
  });

  const [schemes, setSchemes] = useState<any[]>([]);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof FormState;
    const value = e.target.value;

    const updatedForm = { ...form, [name]: value } as FormState;

    // Clear income if occupation is set to student
    if (name === "occupation" && value === "student") {
      updatedForm.income = "";
    }

    setForm(updatedForm);
  };

  const findSchemes = async () => {
    try {
      setLoading(true);
      const payload: Record<string, any> = {
        age: Number(form.age),
        occupation: form.occupation,
        category: form.category,
        gender: form.gender,
        state: form.state,
        language: form.language // Forwarded safely to backend mapping route
      };

      // Only include income when provided and not a student
      if (form.income && form.occupation !== "student") {
        payload.income = Number(form.income);
      }

      const res = await axios.post("/api/schemes", payload);

      setSchemes(res.data.schemes || []);
      setAiExplanation(res.data.aiExplanation || "");
    } catch (error) {
      console.log(error);
      setSchemes([]);
      setAiExplanation("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-5xl font-bold">Scheme Eligibility Checker</h1>
          <p className="text-gray-400 mt-3 text-lg">Discover government schemes you may qualify for.</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          {/* Form */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold mb-8">Quick Profile</h2>
            <div className="space-y-5">

              <div className="flex items-center gap-4">
                <label htmlFor="age" className="w-32 text-sm font-semibold text-gray-300">AGE :</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={form.age}
                  onChange={handleChange}
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="state" className="w-32 text-sm font-semibold text-gray-300">STATE :</label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="occupation" className="w-32 text-sm font-semibold text-gray-300">OCCUPATION :</label>
                <select
                  id="occupation"
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
                >
                  <option value="">Select Occupation</option>
                  <option value="student">Student</option>
                  <option value="farmer">Farmer</option>
                  <option value="worker">Worker</option>
                  <option value="business">Business</option>
                </select>
              </div>

              {form.occupation !== "student" && (
                <div className="flex items-center gap-4">
                  <label htmlFor="income" className="w-32 text-sm font-semibold text-gray-300">ANNUAL INCOME :</label>
                  <input
                    id="income"
                    type="number"
                    name="income"
                    placeholder="Annual Income"
                    value={form.income}
                    onChange={handleChange}
                    className="flex-1 bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-4">
                <label htmlFor="category" className="w-32 text-sm font-semibold text-gray-300">CATEGORY :</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
                >
                  <option value="">Category</option>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="gender" className="w-32 text-sm font-semibold text-gray-300">GENDER :</label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="language" className="w-32 text-sm font-semibold text-gray-300">LANGUAGE :</label>
                <select
                  id="language"
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="flex-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-xl px-5 py-4 outline-none font-semibold"
                >
                  <option value="english">Output Explanation: English</option>
                  <option value="hindi">आउटपुट स्पष्टीकरण: हिंदी</option>
                </select>
              </div>

              <button
                onClick={findSchemes}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-[1.02] transition-all font-semibold"
              >
                {loading ? "Finding Schemes..." : "Find My Schemes"}
              </button>

            </div>
          </div>

          {/* Results Side */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold mb-8">Matched Schemes</h2>
            {schemes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Fill the profile to see your matches.
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  {schemes.map((scheme, index) => (
                    <a
                      key={index}
                      href={`/schemes/${scheme.id}`}
                      className="block rounded-2xl border border-white/10 bg-white/10 p-6 hover:border-purple-500 hover:-translate-y-1 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold">{scheme.name}</h3>
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                          {scheme.category}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-3 leading-relaxed">{scheme.description}</p>
                      <div className="flex flex-wrap gap-2 mt-5">
                        {scheme.benefits?.map((benefit: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300">
                            {benefit}
                          </span>
                        ))}
                      </div>
                      <button className="mt-6 px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-sm font-semibold">
                        Explore Scheme
                      </button>
                    </a>
                  ))}
                </div>

                {aiExplanation && (
                  <div className="mt-8 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-6">
                    <h3 className="text-2xl font-semibold mb-4">AI Recommendation</h3>
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed font-sans text-base">
                      {aiExplanation}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </section>
    </main>
  );
}