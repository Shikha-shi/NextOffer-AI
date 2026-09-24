import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

       <Link to="/" className="text-2xl font-extrabold text-white">
  NextOffer AI
</Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-[#FF7A00] hover:bg-[#e66d00] px-5 py-2.5
              rounded-lg font-semibold transition"
            >
              Get Started
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">

          <div className="max-w-4xl mx-auto text-center">

            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2
              rounded-full bg-[#172554] border border-[#06B6D4]/30
              text-[#06B6D4] text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-pulse" />
              AI-Powered Career Development
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Build Your Career.
              <br />
              <span className="text-[#FF7A00]">
                Get Your Next Offer.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-2xl mx-auto text-lg md:text-xl
              text-gray-400 leading-relaxed"
            >
              NextOffer AI helps students understand their skills,
              identify career gaps, improve their resumes, and discover
              opportunities tailored to their career goals.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row
              justify-center gap-4"
            >
              <Link
                to="/register"
                className="px-8 py-4 bg-[#FF7A00]
                hover:bg-[#e66d00] rounded-xl font-bold
                text-lg transition shadow-lg shadow-orange-500/20"
              >
                Start Your Career Journey
              </Link>

              <Link
                to="/login"
                className="px-8 py-4 border border-[#06B6D4]/50
                hover:bg-[#172554] rounded-xl font-semibold
                text-lg text-[#06B6D4] transition"
              >
                Login
              </Link>
            </div>

          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">

            {/* Feature 1 */}
            <div className="bg-[#172554] border border-blue-900/60
              rounded-2xl p-7 hover:border-[#FF7A00]/50
              transition"
            >
              <div className="w-12 h-12 rounded-xl
                bg-[#FF7A00]/10 flex items-center justify-center
                text-2xl mb-5"
              >
                🎯
              </div>

              <h3 className="text-xl font-bold">
                Career Guidance
              </h3>

              <p className="mt-3 text-gray-400 leading-relaxed">
                Discover career paths based on your education,
                skills, interests, and goals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#172554] border border-blue-900/60
              rounded-2xl p-7 hover:border-[#06B6D4]/50
              transition"
            >
              <div className="w-12 h-12 rounded-xl
                bg-[#06B6D4]/10 flex items-center justify-center
                text-2xl mb-5"
              >
                📊
              </div>

              <h3 className="text-xl font-bold">
                Skill Gap Analysis
              </h3>

              <p className="mt-3 text-gray-400 leading-relaxed">
                Identify the skills you need to develop for your
                desired career and job roles.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#172554] border border-blue-900/60
              rounded-2xl p-7 hover:border-[#06B6D4]/50
              transition"
            >
              <div className="w-12 h-12 rounded-xl
                bg-[#06B6D4]/10 flex items-center justify-center
                text-2xl mb-5"
              >
                🤖
              </div>

              <h3 className="text-xl font-bold">
                AI Career Assistant
              </h3>

              <p className="mt-3 text-gray-400 leading-relaxed">
                Get personalized AI-powered guidance throughout
                your career development journey.
              </p>
            </div>

          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6
          flex flex-col md:flex-row items-center
          justify-between gap-3"
        >
          <p className="text-gray-500 text-sm">
            © 2026 NextOffer AI. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm">
            AI-powered career development for students.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Welcome;