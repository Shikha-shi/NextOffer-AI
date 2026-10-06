import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface ResourceItem {
  title: string;
  url: string;
}

interface LearningResource {
  skill: string;
  priority: string;
  reason: string;
  videos: ResourceItem[];
  notes: ResourceItem[];
  practice: ResourceItem[];
  courses: ResourceItem[];
  project: string;
}

interface LearningResourcesResponse {
  selected_career: string | null;
  available_careers: string[];
  career_match_percentage: number;
  current_skills: string[];
  resources: LearningResource[];
  message?: string;
}

const LearningResources = () => {
  const { token } = useAuth();

  const [data, setData] = useState<LearningResourcesResponse | null>(null);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [loading, setLoading] = useState(true);
  const [changingCareer, setChangingCareer] = useState(false);
  const [error, setError] = useState("");

  const getLearningResources = async (career?: string) => {
    if (!token) {
      setError("Please login again to continue.");
      setLoading(false);
      return;
    }

    if (career) {
      setChangingCareer(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const url = career
        ? `/api/learning-resources?career=${encodeURIComponent(career)}`
        : "/api/learning-resources";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            result.message ||
            "Failed to load learning resources."
        );
      }

      if (result.message && !result.selected_career) {
        setError(result.message);
      }

      setData(result);

      if (result.selected_career) {
        setSelectedCareer(result.selected_career);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
      setChangingCareer(false);
    }
  };

  useEffect(() => {
    getLearningResources();
  }, [token]);

  const handleCareerChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const career = event.target.value;

    setSelectedCareer(career);
    getLearningResources(career);
  };

  const getPriorityStyle = (priority: string) => {
    if (priority.toLowerCase() === "critical") {
      return "bg-red-500/10 text-red-300 border-red-500/20";
    }

    if (priority.toLowerCase() === "high") {
      return "bg-orange-500/10 text-orange-300 border-orange-500/20";
    }

    return "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
            NextOffer AI
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Learning Resources
          </h1>

          <p className="mt-2 max-w-3xl text-slate-400">
            Build the skills you need with personalized videos, notes,
            practice platforms, courses, and project recommendations.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
              <p className="text-slate-400">
                Loading your learning resources...
              </p>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-8">

            {/* Career Selection */}
            <div className="rounded-2xl border border-blue-900/60 bg-[#172554] p-6 shadow-xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                <div className="flex-1">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
                    Personalized Learning
                  </p>

                  <h2 className="text-2xl font-bold">
                    Choose Your Career Path
                  </h2>

                  <p className="mt-2 max-w-2xl text-slate-400">
                    Select a career field to get learning resources
                    specifically designed for that path.
                  </p>

                  <div className="mt-5">
                    <label
                      htmlFor="career"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Career Field
                    </label>

                    <select
                      id="career"
                      value={selectedCareer}
                      onChange={handleCareerChange}
                      disabled={changingCareer}
                      className="w-full max-w-xl rounded-xl border border-slate-600 bg-[#0B1220] px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {data.available_careers.map((career) => (
                        <option
                          key={career}
                          value={career}
                        >
                          {career}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="min-w-[180px] rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 text-center">
                  <p className="text-sm text-slate-400">
                    Career Match
                  </p>

                  <p className="mt-1 text-4xl font-bold text-cyan-300">
                    {data.career_match_percentage}%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Based on your resume
                  </p>
                </div>

              </div>

              {changingCareer && (
                <div className="mt-4 text-sm text-cyan-300">
                  Loading resources for {selectedCareer}...
                </div>
              )}
            </div>

            {/* Career Summary */}
            {data.selected_career && (
              <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#172554] to-[#0e7490] p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                      Your Learning Path
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {data.selected_career}
                    </h2>

                    <p className="mt-2 text-slate-300">
                      Focus on the skills below to become stronger in this
                      career field.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 px-6 py-4 text-center">
                    <p className="text-sm text-slate-400">
                      Resources
                    </p>

                    <p className="mt-1 text-3xl font-bold text-white">
                      {data.resources.length}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Current Skills */}
            <div className="rounded-2xl border border-blue-900/60 bg-[#172554] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Your Current Skills
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Skills detected from your resume.
                  </p>
                </div>

                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                  {data.current_skills.length} Skills
                </span>
              </div>

              {data.current_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.current_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">
                  No skills detected from your resume.
                </p>
              )}
            </div>

            {/* Learning Resources */}
            {data.resources.length > 0 ? (
              <div>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold">
                    Skills You Should Learn
                  </h2>

                  <p className="mt-1 text-slate-400">
                    Explore curated resources for your selected career.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {data.resources.map((resource) => (
                    <div
                      key={resource.skill}
                      className="rounded-2xl border border-blue-900/60 bg-[#172554] p-6 transition hover:border-cyan-500/40"
                    >

                      {/* Skill Header */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                          <h3 className="text-xl font-bold">
                            {resource.skill}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {resource.reason}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-lg border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                            resource.priority
                          )}`}
                        >
                          {resource.priority}
                        </span>

                      </div>

                      {/* Resource Cards */}
                      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

                        {/* Videos */}
                        <div className="rounded-xl border border-slate-700 bg-[#0B1220] p-4">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-sm text-red-300">
                              ▶
                            </div>

                            <h4 className="font-semibold">
                              Videos
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {resource.videos.map((item) => (
                              <a
                                key={item.title}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:border-red-500/30 hover:text-white"
                              >
                                {item.title}
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="rounded-xl border border-slate-700 bg-[#0B1220] p-4">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-sm text-blue-300">
                              N
                            </div>

                            <h4 className="font-semibold">
                              Notes
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {resource.notes.map((item) => (
                              <a
                                key={item.title}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500/30 hover:text-white"
                              >
                                {item.title}
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Practice */}
                        <div className="rounded-xl border border-slate-700 bg-[#0B1220] p-4">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-sm text-orange-300">
                              P
                            </div>

                            <h4 className="font-semibold">
                              Practice
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {resource.practice.map((item) => (
                              <a
                                key={item.title}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:border-orange-500/30 hover:text-white"
                              >
                                {item.title}
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Courses */}
                        <div className="rounded-xl border border-slate-700 bg-[#0B1220] p-4">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-sm text-green-300">
                              C
                            </div>

                            <h4 className="font-semibold">
                              Free Courses
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {resource.courses.map((item) => (
                              <a
                                key={item.title}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:border-green-500/30 hover:text-white"
                              >
                                {item.title}
                              </a>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Recommended Project */}
                      {resource.project && (
                        <div className="mt-4 rounded-xl border border-[#FF7A00]/20 bg-[#FF7A00]/5 p-4">
                          <p className="text-sm font-semibold text-[#FF7A00]">
                            Recommended Project
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {resource.project}
                          </p>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-700 bg-[#172554] p-8 text-center">
                <h2 className="text-xl font-semibold">
                  No Learning Resources Available
                </h2>

                <p className="mt-2 text-slate-400">
                  Try selecting another career field.
                </p>
              </div>
            )}

            {/* Change Career */}
            <div className="rounded-2xl border border-cyan-500/20 bg-[#111827] p-6 text-center">
              <h2 className="text-xl font-semibold">
                Explore Another Career
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Select another career above to generate a different
                personalized learning path.
              </p>

              <button
                type="button"
                onClick={() => {
                  const selector = document.getElementById("career");

                  if (selector) {
                    selector.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
                className="mt-5 rounded-xl border border-cyan-500/40 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/10"
              >
                Change Career
              </button>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LearningResources;