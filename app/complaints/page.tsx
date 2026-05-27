import Navbar from "@/components/shared/Navbar";

export default function ComplaintsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <h1 className="text-5xl font-bold">
            AI complaint assistant
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Describe your issue. AI drafts a formal complaint instantly.
          </p>

        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          {/* Input Side */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Describe your issue
            </h2>

            <textarea
              rows={10}
              placeholder="Example: There is no water supply in my area since 3 days..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none resize-none"
            />

            <div className="grid grid-cols-2 gap-5 mt-6">

              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none">
                <option>Issue Type</option>
                <option>Water Supply</option>
                <option>Electricity</option>
                <option>Road Damage</option>
              </select>

              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none">
                <option>Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>Urgent</option>
              </select>

            </div>

            <button className="w-full mt-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-[1.02] transition-all">
              Generate Complaint
            </button>

          </div>

          {/* AI Output */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="text-3xl font-bold mb-8">
              AI-generated complaint
            </h2>

            <div className="space-y-6">

              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
                
                <h3 className="text-xl font-semibold mb-3">
                  Detected Department
                </h3>

                <p className="text-gray-400">
                  Municipal Water Department
                </p>

              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
                
                <h3 className="text-xl font-semibold mb-3">
                  Complaint Draft
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  Your AI-generated complaint will appear here.
                </p>

              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
                
                <h3 className="text-xl font-semibold mb-3">
                  AI Recommendations
                </h3>

                <ul className="text-gray-400 space-y-2">
                  <li>• Add location details</li>
                  <li>• Upload supporting images</li>
                  <li>• Mention duration of issue</li>
                </ul>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}