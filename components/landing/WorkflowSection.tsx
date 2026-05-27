const steps = [
    "You ask or upload",
    "AI understands",
    "Smart action",
    "Done for you",
  ];
  
  export default function WorkflowSection() {
    return (
      <section className="px-6 py-24 max-w-6xl mx-auto">
  
        <h2 className="text-5xl font-bold text-center mb-20">
          The AI Workflow
        </h2>
  
        <div className="grid md:grid-cols-4 gap-6">
  
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl border border-white/10 bg-white/5 text-center"
            >
              <div className="text-purple-400 text-4xl font-bold mb-5">
                0{index + 1}
              </div>
  
              <h3 className="text-2xl font-semibold">
                {step}
              </h3>
            </div>
          ))}
  
        </div>
      </section>
    );
  }