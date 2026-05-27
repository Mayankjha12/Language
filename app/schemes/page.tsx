"use client";

import Navbar from "@/components/shared/Navbar";
import { useState } from "react";
import axios from "axios";

export default function SchemesPage() {

  const [form, setForm] = useState({
    age: "",
    income: "",
    occupation: "",
    category: "",
    gender: "",
    state: "",
  });

  const [schemes, setSchemes] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const findSchemes = async () => {

    try {

      setLoading(true);

      const res = await axios.post("/api/schemes", {
        age: Number(form.age),
        income: Number(form.income),
        occupation: form.occupation,
        category: form.category,
        gender: form.gender,
        state: form.state,
      });

      setSchemes(res.data.schemes);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h1 className="text-5xl font-bold">
            Scheme Eligibility Checker
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Discover government schemes you may qualify for.
          </p>

        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

          {/* Form */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="text-2xl font-semibold mb-8">
              Quick Profile
            </h2>

            <div className="space-y-5">

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
              />

              <input
                type="number"
                name="income"
                placeholder="Annual Income"
                value={form.income}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
              />

              <select
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
              >
                <option value="">Select Occupation</option>
                <option value="student">Student</option>
                <option value="farmer">Farmer</option>
                <option value="worker">Worker</option>
                <option value="business">Business</option>
              </select>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
              >
                <option value="">Category</option>
                <option value="general">General</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
              </select>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <button
                onClick={findSchemes}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-[1.02] transition-all"
              >
                {loading ? "Finding..." : "Find My Schemes"}
              </button>

            </div>

          </div>

          {/* Results */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="text-2xl font-semibold mb-8">
              Matched Schemes
            </h2>

            {schemes.length === 0 ? (

              <div className="h-full flex items-center justify-center text-gray-400">
                Fill the profile to see your matches.
              </div>

            ) : (

              <div className="space-y-5">

                {schemes.map((scheme, index) => (

                  <a
                    key={index}
                    href={`/schemes/${scheme.id}`}
                    className="block rounded-2xl border border-white/10 bg-white/10 p-6 hover:border-purple-500 hover:-translate-y-1 transition-all"
                  >

                    <div className="flex items-center justify-between">

                      <h3 className="text-2xl font-semibold">
                        {scheme.name}
                      </h3>

                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                        {scheme.category}
                      </span>

                    </div>

                    <p className="text-gray-400 mt-3 leading-relaxed">
                      {scheme.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">

                      {scheme.benefits?.map(
                        (benefit: string, i: number) => (

                          <span
                            key={i}
                            className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300"
                          >
                            {benefit}
                          </span>

                        )
                      )}

                    </div>

                    <button className="mt-6 px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">

                      Explore Scheme

                    </button>

                  </a>

                ))}

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}