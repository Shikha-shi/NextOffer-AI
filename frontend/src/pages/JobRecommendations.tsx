import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Recommendation {
  role: string;
  match_percentage: number;
  matched_skills: string[];
  required_skills: string[];
}

interface JobRecommendationResult {
  current_skills: string[];
  recommendations: Recommendation[];
}

const JobRecommendations = () => {
  const { token } = useAuth();

  const [result, setResult] =
    useState<JobRecommendationResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRecommendations = async () => {
    if (!token) {
      setError("Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/jobs/recommendations",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to generate recommendations."
        );
      }

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const bestMatch = result?.recommendations?.[0];

  return (
    <div className="min-h-screen bg-[#0B1220] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-cyan-400 font-semibold mb-2">
            NEXT OFFER AI
          </p>

          <h1 className="text-4xl font-bold">
            Job Recommendations
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            Discover career roles that match your current skills
            and identify the skills you need to improve.
          </p>
        </div>

        {/* Initial State */}
        {!result && !loading && (
          <div className="bg-[#172554] border border-blue-900 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <span className="text-2xl text-cyan-400">
                ↗
              </span>
            </div>

            <h2 className="text-2xl font-semibold">
              Find Your Best Career Match
            </h2>

            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              We'll analyze the skills detected from your uploaded
              resume and compare them with different career paths.
            </p>

            <button
              onClick={getRecommendations}
              className="mt-7 bg-[#FF7A00] hover:bg-orange-600 px-7 py-3 rounded-xl font-semibold transition"
            >
              Get Recommendations
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-[#172554] border border-blue-900 rounded-2xl p-10 text-center">
            <div className="w-10 h-10 border-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin mx-auto" />

            <p className="text-gray-300 mt-5">
              Analyzing your skills...
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Finding the best career matches for you.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-8">

            {/* Best Match */}
            {bestMatch && (
              <div className="bg-gradient-to-r from-[#172554] to-[#0e7490] border border-cyan-500/30 rounded-2xl p-8">
                <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                  Best Career Match
                </p>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-4">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {bestMatch.role}
                    </h2>

                    <p className="text-gray-300 mt-2">
                      This role has the strongest match with your
                      current skill set.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-5xl font-bold text-cyan-300">
                      {bestMatch.match_percentage}%
                    </div>

                    <p className="text-gray-400 text-sm mt-1">
                      Skill Match
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all"
                      style={{
                        width: `${bestMatch.match_percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Current Skills */}
            <div className="bg-[#172554] border border-blue-900 rounded-2xl p-7">
              <h2 className="text-xl font-semibold">
                Your Current Skills
              </h2>

              <p className="text-gray-500 text-sm mt-1 mb-5">
                Skills detected from your resume.
              </p>

              <div className="flex flex-wrap gap-2">
                {result.current_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full text-sm bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Career Recommendations */}
            <div>
              <div className="mb-5">
                <h2 className="text-2xl font-bold">
                  Recommended Career Paths
                </h2>

                <p className="text-gray-500 mt-1">
                  Ranked according to your current skill match.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {result.recommendations.map(
                  (recommendation, index) => {
                    const missingSkills =
                      recommendation.required_skills.filter(
                        (skill) =>
                          !recommendation.matched_skills.includes(
                            skill
                          )
                      );

                    return (
                      <div
                        key={recommendation.role}
                        className="bg-[#172554] border border-blue-900 rounded-2xl p-6 hover:border-cyan-500/40 transition"
                      >
                        {/* Role Header */}
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-xs text-gray-500">
                              #{index + 1} Career Match
                            </span>

                            <h3 className="text-xl font-bold mt-1">
                              {recommendation.role}
                            </h3>
                          </div>

                          <div className="text-right">
                            <span className="text-2xl font-bold text-cyan-300">
                              {recommendation.match_percentage}%
                            </span>

                            <p className="text-xs text-gray-500">
                              match
                            </p>
                          </div>
                        </div>

                        {/* Match Bar */}
                        <div className="mt-5">
                          <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>Skill compatibility</span>

                            <span>
                              {recommendation.match_percentage}%
                            </span>
                          </div>

                          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FF7A00] rounded-full"
                              style={{
                                width: `${recommendation.match_percentage}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Matched Skills */}
                        <div className="mt-6">
                          <p className="text-sm font-semibold text-green-300 mb-3">
                            Matched Skills
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {recommendation.matched_skills.map(
                              (skill) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-1 rounded-lg text-xs bg-green-500/10 text-green-300 border border-green-500/20"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        {/* Skills To Improve */}
                        {missingSkills.length > 0 && (
                          <div className="mt-6">
                            <p className="text-sm font-semibold text-orange-300 mb-3">
                              Skills To Improve
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {missingSkills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-1 rounded-lg text-xs bg-orange-500/10 text-orange-300 border border-orange-500/20"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Analyze Again */}
            <div className="text-center pt-2">
              <button
                onClick={getRecommendations}
                disabled={loading}
                className="border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 px-6 py-3 rounded-xl font-semibold transition"
              >
                Analyze Again
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;