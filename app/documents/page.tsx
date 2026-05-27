import Navbar from "@/components/shared/Navbar";

export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <h1 className="text-5xl font-bold">
            AI document explainer
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Upload any official document. Get plain-language AI summaries.
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
                Upload document
              </h2>

              <p className="text-gray-400 mt-4">
                PDF, JPG, PNG up to 20MB
              </p>

              <button className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
                Choose File
              </button>

            </div>

          </div>

          {/* AI Summary */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="text-3xl font-bold mb-8">
              AI Summary
            </h2>

            <div className="space-y-6 text-gray-300 leading-relaxed">

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Document Purpose
                </h3>

                <p>
                  Upload a document to generate AI explanation.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Important Dates
                </h3>

                <p>
                  AI will detect deadlines and dates automatically.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Required Actions
                </h3>

                <p>
                  AI will explain next steps in simple language.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}