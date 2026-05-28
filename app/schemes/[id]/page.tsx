import { schemes } from "@/data/schemes";

export default async function SchemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const scheme = schemes.find(
    (item) => item.id === id
  );

  if (!scheme) {

    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        Scheme not found
      </main>
    );

  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="max-w-5xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">

          <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm">
            {scheme.category}
          </span>

          <h1 className="text-5xl font-bold mt-6">
            {scheme.name}
          </h1>

          <p className="text-gray-400 text-xl mt-6 leading-relaxed">
            {scheme.description}
          </p>

        </div>

        {/* Benefits */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-3xl font-semibold mb-6">
            Benefits
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {scheme.benefits.map(
              (benefit: string, index: number) => (

                <div
                  key={index}
                  className="rounded-2xl bg-white/10 border border-white/10 p-5"
                >

                  {benefit}

                </div>

              )
            )}

          </div>

        </div>

        {/* Eligibility */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-3xl font-semibold mb-6">
            Eligibility
          </h2>

          <div className="rounded-xl bg-white/10 border border-white/10 p-4">

            Annual income should be below ₹
            {scheme.eligibility.maxIncome.toLocaleString()}

          </div>

        </div>

        {/* Documents */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-3xl font-semibold mb-6">
            Required Documents
          </h2>

          <div className="flex flex-wrap gap-4">

            {scheme.documents.map(
              (doc: string, index: number) => (

                <div
                  key={index}
                  className="px-5 py-3 rounded-full bg-white/10 border border-white/10"
                >

                  {doc}

                </div>

              )
            )}

          </div>

        </div>

        {/* Apply */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-10 text-center">

          <h2 className="text-4xl font-bold">
            Ready to Apply?
          </h2>

          <p className="text-gray-300 mt-4 text-lg">
            Visit the official portal and complete your application.
          </p>

          <a
            href={scheme.applyLink}
            target="_blank"
            className="inline-block mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition-all"
          >

            Apply Now

          </a>

        </div>

      </section>

    </main>
  );
}