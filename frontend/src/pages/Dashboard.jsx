import React, { useState, useEffect } from "react";

function Dashboard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const email = localStorage.getItem("userEmail");

  const handleCheck = async () => {
    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, email }),
    });

    const data = await res.json();
    setResult(data);

    fetchHistory();
  };

  const fetchHistory = async () => {
    const res = await fetch(`http://localhost:8000/history/${email}`);
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    if (!email) {
      window.location.href = "/auth";
    } else {
      fetchHistory();
    }
  }, []);

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
          disabled={!text}
          className="bg-primary px-8 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {text ? "Check" : "Enter text"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 p-4 bg-card rounded-xl">
          <p>Prediction: {result.credibility}</p>
          <p>Confidence: {result.confidence}</p>
          <p>Sentiment: {result.sentiment}</p>
        </div>
      )}

      {/* History */}
      <h2 className="text-2xl mt-8 mb-4">History</h2>

      {/* 🔥 EMPTY STATE */}
      {history.length === 0 ? (
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