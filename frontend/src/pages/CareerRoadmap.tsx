import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface CareerDirection {
  primary: string;
  secondary: string;
  reason: string;
}

interface SkillCategory {
  priority: string;
  category: string;
  skills: string[];
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  resume_value: string;
}

interface PreparationStep {
  title: string;
  description: string;
}

interface RoadmapStage {
  period: string;
  title: string;
  goals: string[];
}

interface Roadmap {
  career_direction: CareerDirection;
  skills_to_learn: SkillCategory[];
  projects: Project[];
  job_preparation: PreparationStep[];
  short_term: RoadmapStage[];
  long_term: RoadmapStage[];
}

interface RoadmapResponse {
  current_skills: string[];
  roadmap: Roadmap;
}

const priorityStyles: Record<string, string> = {
  Critical:
    "border-red-500/30 bg-red-500/10 text-red-300",
  High:
    "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Medium:
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
};

const CareerRoadmap = () => {
  const { token } = useAuth();

  const [data, setData] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRoadmap = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/career-roadmap",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Failed to generate roadmap"
        );
      }

      if (result.message && !result.roadmap) {
        throw new Error(result.message);
      }

      if (!result.roadmap) {
        throw new Error("Invalid roadmap received from AI.");
      }

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

  return (
    <div className="min-h-screen bg-[#0B1220] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#06B6D4]">
            AI Career Guidance
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Your Career Roadmap
          </h1>

          <p className="mt-3 max-w-3xl text-gray-400">
            A personalized career journey generated from your resume,
            skills, and experience.
          </p>
        </div>

        {!data && (
          <div className="rounded-3xl border border-white/10 bg-[#111827] p-10 text-center shadow-2xl md:p-16">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#06B6D4]/10 text-5xl">
              🗺️
            </div>

            <h2 className="text-3xl font-bold">
              Build Your Career Roadmap
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
              Gemini will analyze your resume and create a personalized
              path covering skills, projects, internships, and long-term
              career goals.
            </p>

            <button
              onClick={generateRoadmap}
              disabled={loading}
              className="mt-8 rounded-xl bg-[#FF7A00] px-8 py-3.5 font-semibold transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Generating Roadmap..."
                : "Generate My Roadmap"}
            </button>

            {error && (
              <p className="mt-5 text-sm text-red-400">
                {error}
              </p>
            )}
          </div>
        )}

        {data && (
          <div className="space-y-10">

            {/* Career Direction */}
            <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-3xl border border-[#06B6D4]/20 bg-gradient-to-br from-[#172554] to-[#111827] p-8 shadow-xl">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#06B6D4]/10 text-2xl">
                    🎯
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#67E8F9]">
                      PRIMARY CAREER DIRECTION
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      {data.roadmap.career_direction.primary}
                    </h2>
                  </div>
                </div>

                <p className="leading-7 text-gray-300">
                  {data.roadmap.career_direction.reason}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-xl">
                <p className="text-sm font-medium text-gray-500">
                  SECONDARY DIRECTION
                </p>

                <h3 className="mt-4 text-xl font-bold">
                  {data.roadmap.career_direction.secondary}
                </h3>

                <div className="mt-6 h-px bg-white/10" />

                <p className="mt-6 text-sm leading-6 text-gray-400">
                  Your roadmap keeps this path open as an alternative
                  specialization.
                </p>
              </div>
            </section>

            {/* Current Skills */}
            <section className="rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-xl">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#06B6D4]">
                  Starting Point
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Your Current Skills
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {data.current_skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-4 py-2 text-sm font-medium text-[#67E8F9]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

           {/* Career Flow */}
<section>
  <div className="mb-8 text-center">
    <p className="text-sm font-semibold uppercase tracking-wider text-[#FF7A00]">
      Your Journey
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      From Skills to Career
    </h2>
  </div>

  <div className="flex items-center gap-3 overflow-x-auto pb-4">
    {[
      ["🧠", "Current Skills", "Your foundation"],
      ["🎯", "Career Target", "Where you're going"],
      ["📚", "Learn", "Build new skills"],
      ["🚀", "Build", "Create strong projects"],
      ["💼", "Get Hired", "Prepare for opportunities"],
    ].map(([icon, title, description], index) => (
      <div
        key={title}
        className="flex min-w-[220px] flex-1 items-center gap-3"
      >
        <div className="w-full rounded-2xl border border-white/10 bg-[#111827] p-5 text-center transition hover:border-[#06B6D4]/40">
          <div className="text-3xl">{icon}</div>

          <h3 className="mt-3 font-bold">
            {title}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>
        </div>

        {index < 4 && (
          <div className="flex shrink-0 items-center justify-center text-2xl font-bold text-[#06B6D4]">
            →
          </div>
        )}
      </div>
    ))}
  </div>
</section>

            {/* Skills */}
            <section>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#06B6D4]">
                  Next Step
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Skills You Should Learn
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {data.roadmap.skills_to_learn.map((item) => (
                  <div
                    key={item.category}
                    className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition hover:border-[#06B6D4]/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold">
                        {item.category}
                      </h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          priorityStyles[item.priority] ||
                          "border-white/10 bg-white/5 text-gray-300"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-[#172554] px-3 py-2 text-sm text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#FF7A00]">
                  Build Your Portfolio
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Recommended Projects
                </h2>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {data.roadmap.projects.map((project, index) => (
                  <div
                    key={project.title}
                    className="flex flex-col rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-lg"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF7A00]/10 font-bold text-[#FF7A00]">
                      {index + 1}
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {project.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-6 text-gray-400">
                      {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-[#172554] px-3 py-1 text-xs text-[#93C5FD]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 rounded-xl border border-[#06B6D4]/10 bg-[#06B6D4]/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#67E8F9]">
                        Resume Value
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {project.resume_value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Job Preparation */}
            <section className="rounded-3xl border border-white/10 bg-[#111827] p-8">
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#06B6D4]">
                  Career Preparation
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Get Job Ready
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {data.roadmap.job_preparation.map(
                  (step, index) => (
                    <div
                      key={step.title}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-[#0B1220] p-5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#06B6D4]/10 font-bold text-[#67E8F9]">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-bold">
                          {step.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Short Term */}
            <section>
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#FF7A00]">
                  Next 6 Months
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Short-Term Roadmap
                </h2>
              </div>

              <div className="relative">
                <div className="absolute left-5 top-0 hidden h-full w-px bg-[#06B6D4]/30 md:block" />

                <div className="space-y-6">
                  {data.roadmap.short_term.map((stage) => (
                    <div
                      key={stage.period}
                      className="relative md:pl-14"
                    >
                      <div className="absolute left-2 top-6 hidden h-7 w-7 rounded-full border-4 border-[#0B1220] bg-[#06B6D4] md:block" />

                      <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                        <span className="inline-block rounded-full bg-[#06B6D4]/10 px-3 py-1 text-xs font-semibold text-[#67E8F9]">
                          {stage.period}
                        </span>

                        <h3 className="mt-4 text-xl font-bold">
                          {stage.title}
                        </h3>

                        <div className="mt-4 space-y-2">
                          {stage.goals.map((goal) => (
                            <div
                              key={goal}
                              className="flex gap-3 text-sm text-gray-400"
                            >
                              <span className="text-[#06B6D4]">
                                ✓
                              </span>

                              <span>{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Long Term */}
            <section>
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#06B6D4]">
                  Long-Term Vision
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Your Path to Graduation
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {data.roadmap.long_term.map((stage, index) => (
                  <div
                    key={stage.period}
                    className="relative rounded-2xl border border-white/10 bg-[#111827] p-6"
                  >
                    <div className="text-4xl font-black text-[#06B6D4]/20">
                      0{index + 1}
                    </div>

                    <p className="mt-2 text-sm font-semibold text-[#67E8F9]">
                      {stage.period}
                    </p>

                    <h3 className="mt-2 text-xl font-bold">
                      {stage.title}
                    </h3>

                    <div className="mt-5 space-y-3">
                      {stage.goals.map((goal) => (
                        <div
                          key={goal}
                          className="flex gap-3 text-sm leading-6 text-gray-400"
                        >
                          <span className="text-[#FF7A00]">
                            →
                          </span>

                          <span>{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Regenerate */}
            <div className="pb-6 text-center">
              <button
                onClick={generateRoadmap}
                disabled={loading}
                className="rounded-xl border border-[#06B6D4]/40 px-7 py-3 font-semibold text-[#67E8F9] transition hover:bg-[#06B6D4]/10 disabled:opacity-60"
              >
                {loading
                  ? "Generating..."
                  : "Regenerate Roadmap"}
              </button>

              {error && (
                <p className="mt-4 text-sm text-red-400">
                  {error}
                </p>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmap;