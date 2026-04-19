import { useState } from "react";

const SAMPLE_NEWS = [
  {
    label: "Fed Rate Hike",
    text: "Federal Reserve raises interest rates by 0.5% amid rising inflation concerns, marking the largest hike in 22 years.",
  },
  {
    label: "Crypto Scam",
    text: "Bitcoin to reach $500,000 by end of month as secret government deal guarantees massive price surge for all holders.",
  },
  {
    label: "Market Report",
    text: "S&P 500 closes at record high as strong earnings from tech giants boost investor confidence across global markets.",
  },
];

function Home() {
  const [newsText, setNewsText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!newsText.trim()) {
      setError("Please enter some news text before analyzing.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch("https://finverify-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newsText }),
      });
      if (!response.ok)
        throw new Error("Backend not responding. Check FastAPI server.");
      const data = await response.json();
      setResult(data);
      // Save to recent history (max 4)
      setHistory((prev) =>
        [
          {
            text: newsText.length > 60 ? newsText.slice(0, 60) + "…" : newsText,
            prediction: data.prediction,
            confidence: data.confidence,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          ...prev,
        ].slice(0, 4),
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setNewsText("");
    setResult(null);
    setError("");
  };

  const isReal = result?.prediction === "Real";

  return (
    <main className="max-w-2xl mx-auto px-6 pb-24">
      {/* ── Hero ── */}
      <section className="text-center pt-16 pb-10">
        <span className="inline-block border border-white/20 text-textBase/60 text-[0.65rem] font-semibold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full mb-8">
          AI-Powered Analysis
        </span>
        <h1 className="font-heading text-[2.6rem] md:text-[3.2rem] font-bold text-textBase leading-[1.2] tracking-[-0.02em] mb-5">
          Fake Financial
          <br />
          <span className="text-primary">News Detector</span>
        </h1>
        <p className="text-textBase/50 text-[0.95rem] leading-[1.75] max-w-md mx-auto font-normal">
          Paste any financial news headline or article below. Our DistilBERT
          model will instantly analyze and tell you whether it's real or fake.
        </p>
      </section>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "News Analyzed", value: "12,480+" },
          { label: "Model Accuracy", value: "94.3%" },
          { label: "Avg. Response", value: "0.8s" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card backdrop-blur-xl border border-cardBorder shadow-2xl rounded-xl px-4 py-3 text-center transition-transform hover:-translate-y-1 duration-300"
          >
            <p className="text-textBase font-bold text-lg leading-tight">
              {stat.value}
            </p>
            <p className="text-textBase/35 text-[0.68rem] font-medium mt-0.5 tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Analyzer Card ── */}
      <div className="bg-card backdrop-blur-2xl border border-cardBorder shadow-2xl shadow-primary/5 rounded-2xl p-6">
        <label
          htmlFor="news-input"
          className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-textBase/40 mb-3"
        >
          Enter Financial News Text
        </label>
        <form onSubmit={handleAnalyze}>
          <textarea
            id="news-input"
            rows={6}
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
            placeholder="Paste financial news snippet here..."
            required
            className="w-full bg-black/30 border border-white/10 rounded-xl text-textBase text-sm leading-relaxed p-4 resize-none placeholder-textBase/20 focus:outline-none focus:border-primary/60 transition-colors duration-200 font-normal"
          />
          <p className="text-[0.72rem] text-textBase/30 mt-2 mb-3">
            {newsText.length} characters
          </p>
          {error && (
            <p className="text-[#FE7743] text-sm mb-3 font-medium">⚠ {error}</p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:brightness-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Check Credibility"
              )}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="border border-white/15 text-textBase/40 text-sm px-5 py-2.5 rounded-lg hover:text-textBase hover:border-white/30 transition-colors duration-150"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* ── Result ── */}
      {result && (
        <div
          className={`mt-4 rounded-xl border p-6 ${
            isReal
              ? "bg-emerald-500/10 border-emerald-500/25"
              : "bg-[#FE7743]/10 border-[#FE7743]/25"
          }`}
          style={{ animation: "fadeUp 0.3s ease" }}
        >
          <h2 className="font-heading text-base font-semibold text-textBase text-center mb-4 tracking-tight">
            Analysis Result
          </h2>
          <p className="text-center mb-1 text-sm">
            <span className="text-textBase/50">Prediction: </span>
            <span
              className={`font-bold text-base ${isReal ? "text-emerald-400" : "text-[#FE7743]"}`}
            >
              {result.prediction}
            </span>
          </p>
          <p className="text-center text-sm text-textBase/50 mb-4">
            Confidence:{" "}
            <span className="text-textBase font-semibold">
              {Number(result.confidence).toFixed(2)}%
            </span>
          </p>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-700 ${isReal ? "bg-emerald-400" : "bg-[#FE7743]"}`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
          {result.text_analyzed && (
            <p className="text-center text-xs italic text-textBase/35 mt-3">
              &ldquo;{result.text_analyzed}&rdquo;
            </p>
          )}
        </div>
      )}

      {/* ── Sample News ── */}
      <div className="mt-10">
        <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-textBase/30 mb-3">
          Try a Sample
        </p>
        <div className="flex flex-col gap-2">
          {SAMPLE_NEWS.map((sample) => (
            <button
              key={sample.label}
              onClick={() => {
                setNewsText(sample.text);
                setResult(null);
                setError("");
              }}
              className="bg-card/50 backdrop-blur-sm border border-cardBorder hover:border-primary/40 rounded-xl px-4 py-3 text-left transition-all duration-300 group hover:shadow-[0_4px_20px_rgba(254,119,67,0.1)]"
            >
              <span className="text-[0.65rem] font-semibold tracking-widest uppercase text-primary/70 group-hover:text-primary transition-colors">
                {sample.label}
              </span>
              <p className="text-textBase/50 text-xs leading-relaxed mt-1 group-hover:text-textBase/70 transition-colors">
                {sample.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Predictions ── */}
      {history.length > 0 && (
        <div className="mt-10">
          <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-textBase/30 mb-3">
            Recent Predictions
          </p>
          <div className="bg-card/80 backdrop-blur-lg border border-cardBorder shadow-xl rounded-2xl overflow-hidden">
            {history.map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 gap-4 hover:bg-white/5 transition-colors duration-200 ${
                  i !== history.length - 1 ? "border-b border-cardBorder" : ""
                }`}
              >
                <p className="text-textBase/55 text-xs leading-relaxed flex-1 truncate">
                  {item.text}
                </p>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-textBase/30 text-[0.65rem]">
                    {item.time}
                  </span>
                  <span
                    className={`text-[0.65rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                      item.prediction === "Real"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-[#FE7743]/15 text-[#FE7743]"
                    }`}
                  >
                    {item.prediction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

export default Home;
