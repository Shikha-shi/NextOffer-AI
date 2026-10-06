import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface ResourceLink {
  title: string;
  url: string;
}

interface LearningResource {
  skill: string;
  priority: string;
  reason: string;
  videos: ResourceLink[];
  notes: ResourceLink[];
  practice: ResourceLink[];
  courses: ResourceLink[];
  project: string;
}

interface LearningResponse {
  career_target: string;
  career_match_percentage: number;
  current_skills: string[];
  resources: LearningResource[];
}

const LearningResources = () => {
  const { token } = useAuth();

  const [data, setData] = useState<LearningResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(
          "/api/learning-resources",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load learning resources");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchResources();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-400">
            Building your personalized learning plan...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-[#172554] p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold">
            Unable to load resources
          </h2>
          <p className="text-gray-400 mt-3">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <section className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#FF7A00]">
            Personalized Learning
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Your Learning Hub
          </h1>

          <p className="text-gray-400 mt-4 max-w-3xl">
            Learn the skills that will move you closer to your career goal
            with resources selected from your current skill profile.
          </p>
        </section>

        {/* Career Target */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="md:col-span-2 rounded-2xl border border-blue-900/60 bg-[#172554] p-6">
            <p className="text-sm text-gray-400">
              Your Career Target
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {data.career_target}
            </h2>

            <p className="text-gray-400 mt-3">
              Your current resume matches this career path by{" "}
              <span className="text-[#06B6D4] font-semibold">
                {data.career_match_percentage}%
              </span>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-[#111827] p-6">
            <p className="text-sm text-gray-400">
              Current Skills
            </p>

            <p className="text-3xl font-bold mt-2">
              {data.current_skills.length}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              skills detected from your resume
            </p>
          </div>
        </section>

        {/* Learning Resources */}
        <section>
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#06B6D4]">
              Recommended For You
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Skills to Build
            </h2>
          </div>

          <div className="space-y-8">
            {data.resources.map((resource) => (
              <div
                key={resource.skill}
                className="rounded-3xl border border-white/10 bg-[#111827] overflow-hidden"
              >
                {/* Skill Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold">
                          {resource.skill}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            resource.priority === "Critical"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : resource.priority === "High"
                              ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                              : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          }`}
                        >
                          {resource.priority}
                        </span>
                      </div>

                      <p className="text-gray-400 mt-3 max-w-3xl">
                        {resource.reason}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resource Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-6">

                  {/* Videos */}
                  <div className="rounded-2xl bg-[#172554] border border-blue-900/50 p-5">
                    <div className="text-3xl">🎥</div>

                    <h4 className="font-bold text-lg mt-3">
                      Videos
                    </h4>

                    <div className="mt-4 space-y-3">
                      {resource.videos.map((item) => (
                        <a
                          key={item.url}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-sm text-gray-300 hover:text-[#06B6D4] transition"
                        >
                          {item.title} →
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="rounded-2xl bg-[#172554] border border-blue-900/50 p-5">
                    <div className="text-3xl">📝</div>

                    <h4 className="font-bold text-lg mt-3">
                      Notes
                    </h4>

                    <div className="mt-4 space-y-3">
                      {resource.notes.map((item) => (
                        <a
                          key={item.url}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-sm text-gray-300 hover:text-[#06B6D4] transition"
                        >
                          {item.title} →
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Practice */}
                  <div className="rounded-2xl bg-[#172554] border border-blue-900/50 p-5">
                    <div className="text-3xl">🧩</div>

                    <h4 className="font-bold text-lg mt-3">
                      Practice
                    </h4>

                    <div className="mt-4 space-y-3">
                      {resource.practice.map((item) => (
                        <a
                          key={item.url}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-sm text-gray-300 hover:text-[#06B6D4] transition"
                        >
                          {item.title} →
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Courses */}
                  <div className="rounded-2xl bg-[#172554] border border-blue-900/50 p-5">
                    <div className="text-3xl">🎓</div>

                    <h4 className="font-bold text-lg mt-3">
                      Free Courses
                    </h4>

                    <div className="mt-4 space-y-3">
                      {resource.courses.map((item) => (
                        <a
                          key={item.url}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-sm text-gray-300 hover:text-[#06B6D4] transition"
                        >
                          {item.title} →
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project */}
                <div className="mx-6 mb-6 rounded-2xl border border-[#FF7A00]/20 bg-[#FF7A00]/5 p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🚀</div>

                    <div>
                      <p className="text-sm font-semibold text-[#FF7A00] uppercase tracking-wide">
                        Recommended Project
                      </p>

                      <p className="text-gray-300 mt-2">
                        {resource.project}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default LearningResources;