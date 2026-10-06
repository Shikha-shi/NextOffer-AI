import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface SkillGapResult {
  role: string;
  current_skills: string[];
  required_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  match_percentage: number;
}

const roles = [
  "backend developer",
  "frontend developer",
  "full stack developer",
  "data scientist",
  "machine learning engineer",
];

const formatRoleName = (role: string) => {
  return role
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

const SkillGap = () => {
  const { token } = useAuth();

  const [role, setRole] = useState("backend developer");
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSkills = async () => {
    if (!token) {
      setError("You are not authenticated. Please login again.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `/api/resume/skill-gap?role=${encodeURIComponent(
          role
        )}`,
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
          data.detail || "Unable to analyze your skills."
        );
      }

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing your skills."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Skill Gap Analysis
          </h1>

          <p className="text-gray-400 mt-2">
            Discover how your current skills match your target
            career and identify the skills you need to develop.
          </p>
        </div>

        {/* Role Selection */}
        <div className="mt-8 bg-[#172554] border border-blue-900/60 rounded-2xl p-6">

          <label
            htmlFor="career-role"
            className="block text-sm font-medium text-gray-300 mb-3"
          >
            Select Target Career
          </label>

          <div className="flex flex-col sm:flex-row gap-4">

            <select
              id="career-role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setResult(null);
                setError("");
              }}
              className="flex-1 bg-[#0B1220] border border-blue-900
              rounded-xl px-4 py-3 text-white outline-none
              focus:border-cyan-400 transition"
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {formatRoleName(item)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={analyzeSkills}
              disabled={loading}
              className="px-6 py-3 rounded-xl
              bg-[#FF7A00]
              hover:bg-orange-600
              disabled:opacity-50
              disabled:cursor-not-allowed
              font-semibold transition"
            >
              {loading ? "Analyzing..." : "Analyze Skills"}
            </button>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30
          text-red-300 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">

            {/* Match + Current Skills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Match Percentage */}
              <div className="bg-[#172554]
              border border-blue-900/60
              rounded-2xl p-6
              flex flex-col items-center justify-center
              text-center">

                <p className="text-gray-400">
                  Skill Match
                </p>

                <p className="text-5xl font-bold text-cyan-400 mt-4">
                  {result.match_percentage}%
                </p>

                <p className="text-gray-400 mt-3">
                  for
                </p>

                <p className="text-white font-semibold mt-1">
                  {formatRoleName(result.role)}
                </p>

              </div>

              {/* Current Skills */}
              <div className="md:col-span-2 bg-[#172554]
              border border-blue-900/60
              rounded-2xl p-6">

                <h2 className="text-xl font-semibold">
                  Your Current Skills
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Skills detected from your uploaded resume.
                </p>

                <div className="flex flex-wrap gap-3 mt-5">

                  {result.current_skills.length > 0 ? (
                    result.current_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-2 rounded-lg
                        bg-cyan-500/10
                        text-cyan-300
                        border border-cyan-500/20"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">
                      No matching skills were detected.
                    </p>
                  )}

                </div>
              </div>
            </div>

            {/* Matched + Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Matched Skills */}
              <div className="bg-[#172554]
              border border-green-500/20
              rounded-2xl p-6">

                <h2 className="text-xl font-semibold text-green-400">
                  Matched Skills
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Skills you already have for this role.
                </p>

                <div className="space-y-3 mt-5">

                  {result.matched_skills.length > 0 ? (
                    result.matched_skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-3
                        bg-green-500/10
                        rounded-lg
                        p-3"
                      >
                        <span className="flex items-center justify-center
                        w-6 h-6 rounded-full
                        bg-green-500/20
                        text-green-400">
                          ✓
                        </span>

                        <span className="text-gray-200">
                          {skill}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">
                      No matched skills found.
                    </p>
                  )}

                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-[#172554]
              border border-orange-500/20
              rounded-2xl p-6">

                <h2 className="text-xl font-semibold text-orange-400">
                  Skills to Develop
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Skills you may need to develop for this role.
                </p>

                <div className="space-y-3 mt-5">

                  {result.missing_skills.length > 0 ? (
                    result.missing_skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-3
                        bg-orange-500/10
                        rounded-lg
                        p-3"
                      >
                        <span className="flex items-center justify-center
                        w-6 h-6 rounded-full
                        bg-orange-500/20
                        text-orange-400">
                          +
                        </span>

                        <span className="text-gray-200">
                          {skill}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">
                      No missing skills detected.
                    </p>
                  )}

                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="bg-[#172554]
            border border-blue-900/60
            rounded-2xl p-6">

              <h2 className="text-xl font-semibold">
                Required Skills
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Skills currently defined for this career role.
              </p>

              <div className="flex flex-wrap gap-3 mt-5">

                {result.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-2 rounded-lg
                    bg-blue-500/10
                    text-blue-300
                    border border-blue-500/20"
                  >
                    {skill}
                  </span>
                ))}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default SkillGap;

