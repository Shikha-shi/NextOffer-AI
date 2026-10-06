import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface StudentProfileData {
  phone: string;
  location: string;
  college: string;
  degree: string;
  branch: string;
  graduation_year: number | null;
  target_role: string;
  preferred_industry: string;
  preferred_location: string;
  work_mode: string;
  technical_skills: string;
  soft_skills: string;
  experience_level: string;
  projects: string;
}

const emptyProfile: StudentProfileData = {
  phone: "",
  location: "",
  college: "",
  degree: "",
  branch: "",
  graduation_year: null,
  target_role: "",
  preferred_industry: "",
  preferred_location: "",
  work_mode: "",
  technical_skills: "",
  soft_skills: "",
  experience_level: "",
  projects: "",
};

function StudentProfile() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [profile, setProfile] = useState<StudentProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "/api/profile/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 404) {
          setProfile(emptyProfile);
          setProfileExists(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load profile.");
        }

        const data = await response.json();

        setProfile({
          phone: data.phone ?? "",
          location: data.location ?? "",
          college: data.college ?? "",
          degree: data.degree ?? "",
          branch: data.branch ?? "",
          graduation_year: data.graduation_year ?? null,
          target_role: data.target_role ?? "",
          preferred_industry: data.preferred_industry ?? "",
          preferred_location: data.preferred_location ?? "",
          work_mode: data.work_mode ?? "",
          technical_skills: data.technical_skills ?? "",
          soft_skills: data.soft_skills ?? "",
          experience_level: data.experience_level ?? "",
          projects: data.projects ?? "",
        });

        setProfileExists(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setProfile((current) => ({
      ...current,
      [name]:
        name === "graduation_year"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        profileExists
          ? "/api/profile/me"
          : "/api/profile/",
        {
          method: profileExists ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to save profile."
        );
      }

      setProfileExists(true);
      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <header className="border-b border-white/10 bg-[#0B1220]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-400 hover:text-white transition"
            >
              ← Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold mt-4">
              Student Profile
            </h1>

            <p className="text-gray-400 mt-1">
              Keep your career profile updated for better opportunities.
            </p>
          </div>

          <div className="hidden sm:block text-right">
            <p className="text-gray-400 text-sm">Logged in as</p>
            <p className="font-medium">{user?.name || "Student"}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {message && (
          <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

              <Field
                label="Location"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="e.g. Kanpur"
              />

              <Field
                label="College"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="Enter college name"
              />

              <Field
                label="Degree"
                name="degree"
                value={profile.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech"
              />

              <Field
                label="Branch"
                name="branch"
                value={profile.branch}
                onChange={handleChange}
                placeholder="e.g. Computer Science and Engineering"
              />

              <Field
                label="Graduation Year"
                name="graduation_year"
                type="number"
                value={profile.graduation_year ?? ""}
                onChange={handleChange}
                placeholder="e.g. 2028"
              />
            </div>
          </section>

          {/* Career Preferences */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">
              Career Preferences
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Target Role"
                name="target_role"
                value={profile.target_role}
                onChange={handleChange}
                placeholder="e.g. Software Developer"
              />

              <Field
                label="Preferred Industry"
                name="preferred_industry"
                value={profile.preferred_industry}
                onChange={handleChange}
                placeholder="e.g. Information Technology"
              />

              <Field
                label="Preferred Location"
                name="preferred_location"
                value={profile.preferred_location}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
              />

              <SelectField
                label="Work Mode"
                name="work_mode"
                value={profile.work_mode}
                onChange={handleChange}
                options={[
                  "On-site",
                  "Hybrid",
                  "Remote",
                ]}
              />

              <SelectField
                label="Experience Level"
                name="experience_level"
                value={profile.experience_level}
                onChange={handleChange}
                options={[
                  "Fresher",
                  "Intern",
                  "Entry Level",
                  "Experienced",
                ]}
              />
            </div>
          </section>

          {/* Skills & Projects */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">
              Skills & Projects
            </h2>

            <div className="space-y-5">
              <TextAreaField
                label="Technical Skills"
                name="technical_skills"
                value={profile.technical_skills}
                onChange={handleChange}
                placeholder="e.g. C++, Python, FastAPI, PostgreSQL"
              />

              <TextAreaField
                label="Soft Skills"
                name="soft_skills"
                value={profile.soft_skills}
                onChange={handleChange}
                placeholder="e.g. Communication, Teamwork, Leadership"
              />

              <TextAreaField
                label="Projects"
                name="projects"
                value={profile.projects}
                onChange={handleChange}
                placeholder="Describe your major projects"
                rows={5}
              />
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 rounded-lg bg-[#FF7A00] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
            >
              {saving
                ? "Saving..."
                : profileExists
                ? "Update Profile"
                : "Create Profile"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  placeholder?: string;
  type?: string;
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: FieldProps) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg bg-[#0B1220] border border-white/10 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#06B6D4] transition"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  options: string[];
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg bg-[#0B1220] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#06B6D4] transition"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  placeholder?: string;
  rows?: number;
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
}: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg bg-[#0B1220] border border-white/10 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#06B6D4] transition resize-none"
      />
    </div>
  );
}

export default StudentProfile;