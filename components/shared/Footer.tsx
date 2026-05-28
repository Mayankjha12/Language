export default function Footer() {
  return (
    <footer className="relative mt-24 grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 border-t border-white/10 bg-[#060816]">
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-cyan-500/10 blur-3xl opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              JanMitra AI
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering citizens with AI-driven access to government
              schemes, documents, complaints, and voice assistance.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Product
            </h3>

            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">
                Dashboard
              </a>

              <a href="#" className="hover:text-white transition">
                Schemes
              </a>

              <a href="#" className="hover:text-white transition">
                Voice AI
              </a>

              <a href="#" className="hover:text-white transition">
                Documents
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Company
            </h3>

            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">
                About
              </a>

              <a href="#" className="hover:text-white transition">
                Contact
              </a>

              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>

              <a href="#" className="hover:text-white transition">
                Terms & Conditions
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Stay Updated
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              Get latest government scheme updates directly in your inbox.
            </p>

           
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-gray-500">
            © 2026 JanMitra AI. Built for smarter citizen services.
          </p>

          <div className="flex items-center gap-5 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">
              Twitter
            </a>

            <a href="#" className="hover:text-white transition">
              GitHub
            </a>

            <a href="#" className="hover:text-white transition">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}