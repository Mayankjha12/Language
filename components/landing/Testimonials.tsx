const testimonials = [
    {
      name: "Sunita D.",
      text: "I found 3 schemes I never knew existed.",
    },
    {
      name: "Ramesh K.",
      text: "Elderly mode solved my pension confusion.",
    },
    {
      name: "Arjun P.",
      text: "Complaint drafting became super easy.",
    },
  ];
  
  export default function Testimonials() {
    return (
      <section className="px-6 py-24 max-w-7xl mx-auto">
  
        <h2 className="text-5xl font-bold text-center mb-20">
          Loved by citizens
        </h2>
  
        <div className="grid md:grid-cols-3 gap-8">
  
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl border border-white/10 bg-white/5"
            >
              <p className="text-lg text-gray-300 mb-8">
                "{item.text}"
              </p>
  
              <div className="text-purple-400 font-semibold">
                {item.name}
              </div>
            </div>
          ))}
  
        </div>
      </section>
    );
  }