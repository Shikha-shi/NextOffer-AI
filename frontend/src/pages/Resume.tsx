import { useEffect, useState, type ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext";

const Resume = () => {
  const { token } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      if (!token) return;

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/resume/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.uploaded) {
          setUploaded(true);
          setFileName(data.file_name);
        }
      } catch (error) {
        console.error("Resume fetch error:", error);
      }
    };

    fetchResume();
  }, [token]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file || !token) {
      setMessage("Please select a PDF resume.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/resume/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed.");
      }

      setUploaded(true);
      setFileName(data.file_name);
      setMessage("Resume uploaded successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold">
          Resume
        </h1>

        <p className="text-gray-400 mt-2">
          Upload your resume to begin AI-powered resume analysis.
        </p>

        <div className="mt-8 bg-[#172554] border border-blue-900/60 rounded-2xl p-8">

          <label className="block text-sm text-gray-300 mb-3">
            Upload Resume
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-[#06B6D4]
            file:text-white
            hover:file:bg-cyan-600"
          />

          {fileName && (
            <div className="mt-5 p-4 rounded-xl bg-[#0B1220]">
              <p className="text-sm text-gray-400">
                Selected Resume
              </p>

              <p className="font-medium mt-1">
                {fileName}
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="mt-6 px-6 py-3 rounded-xl
            bg-[#FF7A00]
            hover:bg-orange-600
            disabled:opacity-50
            disabled:cursor-not-allowed
            font-semibold transition"
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </button>

          {uploaded && !file && (
            <p className="mt-4 text-[#06B6D4]">
              Resume already uploaded: {fileName}
            </p>
          )}

          {message && (
            <p className="mt-4 text-sm text-gray-300">
              {message}
            </p>
          )}

        </div>

      </div>
    </div>
  );
};

export default Resume;