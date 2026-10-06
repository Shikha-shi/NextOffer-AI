import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface CareerRecommendation {
  role: string;
  match_percentage: number;
  matched_skills: string[];
  required_skills: string[];
}

interface CareerResponse {
  current_skills: string[];
  recommendations: CareerRecommendation[];
}

const CareerRecommendations = () => {
  const { token } = useAuth();

  const [data, setData] = useState<CareerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/jobs/recommendations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Failed to load career recommendations"
        );
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

  useEffect(() => {
    if (token) {
      fetchRecommendations();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-400">
            Loading career recommendations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1220] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h1 className="text-2xl font-bold">
              Career Recommendations
            </h1>
            <p className="mt-3 text-red-300">
              {error}
            </p>

            <button
              onClick={fetchRecommendations}
              className="mt-5 rounded-xl bg-[#FF7A00] px-5 py-3 font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B1220] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#06B6D4]">
            AI Career Guidance
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Career Recommendations
          </h1>

          <p className="mt-3 max-w-3xl text-gray-400">
            Explore career paths that match your current skills and
            identify what you need to learn next.
          </p>
        </div>

        {/* Current Skills */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-[#111827] p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#06B6D4]">
            Your Foundation
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Current Skills
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {data.current_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-4 py-2 text-sm text-[#67E8F9]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Career Recommendations */}
        <section>
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#FF7A00]">
              Best Matches
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Career Paths For You
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {data.recommendations.map((career, index) => (
              <div
                key={career.role}
                className="rounded-3xl border border-white/10 bg-[#111827] p-7 transition hover:border-[#06B6D4]/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF7A00]/10 font-bold text-[#FF7A00]">
                        {index + 1}
                      </div>

                      <h3 className="text-xl font-bold">
                        {career.role}
                      </h3>
                    </div>
                  </div>

                  <div className="rounded-full bg-[#06B6D4]/10 px-4 py-2 text-sm font-bold text-[#67E8F9]">
                    {career.match_percentage}%
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-300">
                    Matched Skills
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {career.matched_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-[#06B6D4]/10 px-3 py-2 text-sm text-[#67E8F9]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-300">
                    Skills To Build
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {career.required_skills
                      .filter(
                        (skill) =>
                          !career.matched_skills.includes(skill)
                      )
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-[#FF7A00]/10 px-3 py-2 text-sm text-orange-300"
                        >
                          {skill}
                        </span>
                      ))}
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

export default CareerRecommendations;