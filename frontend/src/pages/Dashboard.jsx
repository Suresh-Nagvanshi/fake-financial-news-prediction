import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { buildUrl, apiRequest } from "../config/api";

function Dashboard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { user } = useAuth();

  const handleCheck = async () => {
    if (!user?.email) {
      alert("Please login first to use this feature");
      return;
    }

    if (!text.trim()) {
      alert("Please enter some text to analyze");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest(buildUrl('/predict'), {
        method: "POST",
        body: JSON.stringify({ text: text.trim(), email: user.email }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResult(data);
      fetchHistory();
    } catch (error) {
      console.error("Prediction error:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert("Network error: Please check your internet connection");
      } else {
        alert("Failed to analyze text: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!user?.email) return;

    setHistoryLoading(true);
    try {
      const res = await apiRequest(buildUrl(`/history/${encodeURIComponent(user.email)}`), {
        method: "GET",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("History fetch error:", error);
      setHistory([]);
      // Don't show alert for history errors to avoid spam
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchHistory();
    }
  }, [user]);

  return (
    <div className="min-h-screen p-6 text-white bg-background">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Search */}
      <textarea
        className="w-full p-4 rounded-xl bg-card border border-white/10"
        placeholder="Enter financial news..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-center mt-4">
        <button
          onClick={handleCheck}
          disabled={!text || loading}
          className="bg-primary px-8 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            text ? "Check" : "Enter text"
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 p-4 bg-card rounded-xl">
          <p>Prediction: {result.prediction}</p>
          <p>Confidence: {result.confidence}</p>
          <p>Sentiment: {result.sentiment}</p>
        </div>
      )}

      {/* History */}
      <h2 className="text-2xl mt-8 mb-4">History</h2>

      {historyLoading ? (
        <div className="text-center text-gray-400 mt-6">
          <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin inline-block" />
          <p className="mt-2">Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-400 mt-6">
          <p>No history yet</p>
          <p className="text-sm mt-2">
            Start by checking a financial news article
          </p>
        </div>
      ) : (
        history.map((item, i) => (
          <div key={i} className="mb-3 p-3 bg-card rounded-lg">
            <p>{item.text}</p>
            <p className="text-sm text-gray-400">
              {item.prediction} • {item.confidence} • {item.sentiment}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
