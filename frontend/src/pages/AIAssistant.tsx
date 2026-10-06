import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIAssistant = () => {
  const { token } = useAuth();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const askAssistant = async (event: FormEvent) => {
    event.preventDefault();

    if (!question.trim() || loading) {
      return;
    }

    const userQuestion = question.trim();

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: userQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to get AI response");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Unable to connect to the AI Assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
            NextOffer AI
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            AI Assistant
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Get personalized guidance for your career, resume, skills,
            interviews, internships, and job preparation.
          </p>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-700 bg-[#111827] shadow-2xl">

          <div className="border-b border-slate-700 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-lg text-cyan-400">
                AI
              </div>

              <div>
                <h2 className="font-semibold">
                  NextOffer AI Assistant
                </h2>

                <p className="text-xs text-slate-400">
                  Personalized career guidance
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {messages.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-xl font-bold text-cyan-400">
                  AI
                </div>

                <h2 className="text-2xl font-semibold">
                  How can I help you?
                </h2>

                <p className="mt-2 max-w-lg text-slate-400">
                  Ask me about interview preparation, career paths,
                  DSA, projects, internships, resumes, or skills.
                </p>

                <div className="mt-6 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  {[
                    "How can I prepare for a backend interview?",
                    "What skills should I learn next?",
                    "Give me some project ideas.",
                    "How should I prepare for internships?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuestion(suggestion)}
                      className="rounded-xl border border-slate-700 bg-[#0B1220] px-4 py-3 text-left text-sm text-slate-300 transition hover:border-cyan-500/50 hover:text-white"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "border border-slate-700 bg-[#0B1220] text-slate-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-slate-700 bg-[#0B1220] px-4 py-3 text-sm text-slate-400">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={askAssistant}
            className="border-t border-slate-700 bg-[#111827] p-4"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask your career question..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
              />

              <button
                type="submit"
                disabled={!question.trim() || loading}
                className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-[#0B1220] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "..." : "Ask"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;