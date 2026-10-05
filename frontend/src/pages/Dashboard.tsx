import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
   const handleLogout = () => {
  logout();
  navigate("/login");
};
const [profileCompletion, setProfileCompletion] = useState(0);

useEffect(() => {
  const fetchProfileCompletion = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/profile/completion",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile completion");
      }

      const data = await response.json();

      setProfileCompletion(data.completion_percentage);
    } catch (error) {
      console.error("Profile completion error:", error);
    }
  };

  fetchProfileCompletion();
}, [token]);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">

      {/* Navbar */}
      <header className="border-b border-white/10 bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link
            to="/dashboard"
            className="text-2xl font-extrabold text-white"
          >
            NextOffer AI
          </Link>

          <div className="flex items-center gap-5">

    <span className="hidden sm:block text-gray-300 text-sm">
  Welcome back, {user?.name || "User"}
</span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border
              border-[#FF7A00]/50 text-[#FF7A00]
              hover:bg-[#FF7A00] hover:text-white
              transition"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome */}
        <section className="mb-10">

          <div className="inline-flex items-center gap-2 px-3 py-1.5
            rounded-full bg-[#172554]
            border border-[#06B6D4]/30
            text-[#06B6D4] text-sm mb-4"
          >
            <span className="w-2 h-2 bg-[#06B6D4] rounded-full" />
            AI Career Platform
          </div>

 <h1 className="text-3xl md:text-4xl font-bold">
  Welcome back, {user?.name || "User"}
</h1>

          <p className="mt-3 text-gray-400 max-w-2xl">
            Track your career progress, improve your skills, analyze your
            resume, and discover opportunities tailored to your goals.
          </p>

        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          <div className="bg-[#172554] border border-blue-900/60
            rounded-2xl p-6"
          >
            <p className="text-gray-400 text-sm">
              Profile Completion
            </p>

            <p className="text-3xl font-bold mt-2">
  {profileCompletion}%
</p>

            <div className="mt-4 h-2 bg-[#0B1220] rounded-full">
              <div
                className="h-2 bg-[#FF7A00] rounded-full"
               style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          <div className="bg-[#172554] border border-blue-900/60
            rounded-2xl p-6"
          >
            <p className="text-gray-400 text-sm">
              Resume Score
            </p>

            <p className="text-3xl font-bold mt-2">
              —
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Upload your resume
            </p>
          </div>

          <div className="bg-[#172554] border border-blue-900/60
            rounded-2xl p-6"
          >
            <p className="text-gray-400 text-sm">
              Skills Added
            </p>

            <p className="text-3xl font-bold mt-2">
              0
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Add your skills
            </p>
          </div>

          <div className="bg-[#172554] border border-blue-900/60
            rounded-2xl p-6"
          >
            <p className="text-gray-400 text-sm">
              Job Matches
            </p>

            <p className="text-3xl font-bold mt-2">
              0
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Complete your profile
            </p>
          </div>

        </section>

        {/* Main Features */}
        <section>

          <h2 className="text-2xl font-bold mb-5">
            Continue Your Career Journey
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Profile */}
            <Link
              to="/profile"
              className="group bg-[#172554] border
              border-blue-900/60 rounded-2xl p-6
              hover:border-[#FF7A00]/60 transition"
            >
              <div className="w-12 h-12 rounded-xl
                bg-[#FF7A00]/10 flex items-center
                justify-center text-2xl"
              >
                👤
              </div>

              <h3 className="text-xl font-bold mt-5">
                Student Profile
              </h3>

              <p className="text-gray-400 mt-2">
                Add your education, experience, projects,
                skills, and career preferences.
              </p>

              <p className="text-[#FF7A00] mt-5 font-semibold">
                Complete Profile →
              </p>
            </Link>

            {/* Resume */}
            <Link
              to="/resume"
              className="group bg-[#172554] border
              border-blue-900/60 rounded-2xl p-6
              hover:border-[#06B6D4]/60 transition"
            >
              <div className="w-12 h-12 rounded-xl
                bg-[#06B6D4]/10 flex items-center
                justify-center text-2xl"
              >
                📄
              </div>

              <h3 className="text-xl font-bold mt-5">
                Resume Analysis
              </h3>

              <p className="text-gray-400 mt-2">
                Upload your resume and get AI-powered
                feedback and improvement suggestions.
              </p>

              <p className="text-[#06B6D4] mt-5 font-semibold">
                Analyze Resume →
              </p>
            </Link>

            {/* Skills */}
            <Link
              to="/skills"
              className="group bg-[#172554] border
              border-blue-900/60 rounded-2xl p-6
              hover:border-[#FF7A00]/60 transition"
            >
              <div className="w-12 h-12 rounded-xl
                bg-[#FF7A00]/10 flex items-center
                justify-center text-2xl"
              >
                📊
              </div>

              <h3 className="text-xl font-bold mt-5">
                Skills & Skill Gap
              </h3>

              <p className="text-gray-400 mt-2">
                Track your skills and identify what you
                need to learn for your target career.
              </p>

              <p className="text-[#FF7A00] mt-5 font-semibold">
                Explore Skills →
              </p>
            </Link>

            {/* Career */}
            <Link
              to="/careers"
              className="group bg-[#172554] border
              border-blue-900/60 rounded-2xl p-6
              hover:border-[#06B6D4]/60 transition"
            >
              <div className="w-12 h-12 rounded-xl
                bg-[#06B6D4]/10 flex items-center
                justify-center text-2xl"
              >
                🎯
              </div>

              <h3 className="text-xl font-bold mt-5">
                Career Recommendations
              </h3>

              <p className="text-gray-400 mt-2">
                Discover career paths that match your
                skills and interests.
              </p>

              <p className="text-[#06B6D4] mt-5 font-semibold">
                Explore Careers →
              </p>
            </Link>

            {/* Jobs */}
            <Link
              to="/jobs"
              className="group bg-[#172554] border
              border-blue-900/60 rounded-2xl p-6
              hover:border-[#FF7A00]/60 transition"
            >
              <div className="w-12 h-12 rounded-xl
                bg-[#FF7A00]/10 flex items-center
                justify-center text-2xl"
              >
                💼
              </div>

              <h3 className="text-xl font-bold mt-5">
                Job Recommendations
              </h3>

              <p className="text-gray-400 mt-2">
                Find opportunities that match your
                career profile.
              </p>

              <p className="text-[#FF7A00] mt-5 font-semibold">
                Find Jobs →
              </p>
            </Link>
            {/* Learning Resources */}
<Link
  to="/learning-resources"
  className="group bg-[#172554] border border-blue-900/60 rounded-2xl p-6 hover:border-[#06B6D4]/60 transition"
>
  <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center text-2xl">
    📚
  </div>

  <h3 className="text-xl font-bold mt-5">
    Learning Resources
  </h3>

  <p className="text-gray-400 mt-2">
    Get personalized videos, notes, practice, courses and projects based on your career goals.
  </p>

  <p className="text-[#06B6D4] mt-5 font-semibold">
    Start Learning →
  </p>
</Link>

            {/* AI Assistant */}
            <Link
              to="/assistant"
              className="group bg-[#172554] border
              border-blue-900/60 rounded-2xl p-6
              hover:border-[#06B6D4]/60 transition"
            >
              <div className="w-12 h-12 rounded-xl
                bg-[#06B6D4]/10 flex items-center
                justify-center text-2xl"
              >
                🤖
              </div>

              <h3 className="text-xl font-bold mt-5">
                AI Career Assistant
              </h3>

              <p className="text-gray-400 mt-2">
                Ask questions and get personalized
                AI-powered career guidance.
              </p>

              <p className="text-[#06B6D4] mt-5 font-semibold">
                Ask NextOffer AI →
              </p>
            </Link>
            {/* Career Roadmap */}
<Link
  to="/career-roadmap"
  className="group bg-[#172554] border
  border-blue-900/60 rounded-2xl p-6
  hover:border-[#FF7A00]/60 transition"
>
  <div className="w-12 h-12 rounded-xl
    bg-[#FF7A00]/10 flex items-center
    justify-center text-2xl"
  >
    🗺️
  </div>

  <h3 className="text-xl font-bold mt-5">
    Career Roadmap
  </h3>

  <p className="text-gray-400 mt-2">
    Get a personalized AI-powered roadmap based on
    your skills, resume, and career goals.
  </p>

  <p className="text-[#FF7A00] mt-5 font-semibold">
    View Roadmap →
  </p>
</Link>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Dashboard;